---
title: 智能指针
description: WebRTC 智能指针使用指南 🧷
ogImage: '../../assets/book.jpg'
---

智能指针是现代 C++ 编程中一个绕不开的话题，WebRTC 也有一套使用智能指针的指南。鉴于 WebRTC 属于 Chromium 的一部分，所以这其实也是 [Chromium 使用智能指针的指南](https://www.chromium.org/developers/smart-pointer-guidelines)。

WebRTC 中最常用的智能指针分别是 `std::unique_ptr` 和 `rtc::scoped_refptr` ，前者用于独占资源，后者用于引用计数。如果读者熟悉 C++ 11，就会发现 `rtc::scoped_refptr` 和 `std::shared_ptr` 很像，但 WebRTC（以及 Chromium）并没有使用 `std::shared_ptr` 。

## 对象所有权和调用约定

*这部分内容译自 [Chromium C++ style guide](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/styleguide/c++/c++.md#object-ownership-and-calling-conventions)。建议读者结合原文观看。*

当一个函数将裸指针或者智能指针作为参数时，需要遵循如下约定。这里我们假定参数类型为 `T` 且参数名为 `t` 。

- 如果这个函数不会修改 `t` 的所有权，则将其声明为 `T*` 。调用方需要保证 `t` 的存活时间足够长，使之在整个函数调用过程中都是有效的。除非在极个别情况下，比如使用 STL 的算法和匿名表达式处理智能指针的容器，你可能必须将参数声明为 `const std::unique_ptr<T>&` ；其他情况下不要这么做。
- 如果这个函数需要取得没有被引用计数（non-refcounted）的对象的所有权，则将其声明为 `std::unique_ptr<T>` 。
- 如果这个函数（至少在某些时候）需要使用到被引用计数（refcounted）的对象，则将其声明为 `scoped_refptr<T>` 。这样调用方既可以选择通过 `std::move(t)` 将该对象的所有权转移给这个函数，也可以选择直接传递 `t` 从而仍然持有该对象的引用。
- 简而言之，这个函数应该永不取得参数类型为裸指针的参数的所有权，并且需要将常量引用（const ref）作为参数的情况也非常罕见。

关于函数返回值的约定也差不多，不过有一点不太一样：

- 当且仅当调用方不需要接管对象的所有权时，才返回裸指针。
- 当函数需要移交（handing off）所有权时，按值（by value）返回 `std::unique_ptr<T>` 或者 `scoped_refptr<T>` 。
- **不同点在于，**当函数需要保持对象的所有权时，应该返回 `const scoped_refptr<T>&` ，这样调用方就不必强行持有该对象的引用（而是持有 `scoped_refptr<T>` 的引用）。这有效减少了该对象的引用计数，[以及编译出的二进制尺寸](https://crrev.com/c/1435627)。

不过在上述约定出现前已经存在大量的 Chromium 代码了。一些函数已经取得了参数类型为 `T*` 的参数的所有权，或者将参数类型声明为 `const scoped_refptr<T>&` 而不是 `T*` ；或者为了避免 C++ 11 之前的引用丢失（refcount churn）问题，其返回值为 `T*` 而不是 `scoped_refptr<T>` 。如果你看到了类似的代码，请尝试清理它们，或者至少不要再传播类似的写法。

## std::unique_ptr

基于上述约定，当一个函数将 `std::unique_ptr` 作为参数时，就意味着它需要取得这个参数的所有权。调用方需要通过 `std::move()` 将（非临时）对象的所有权转移给这个函数：

```cpp:title=作为参数
// Foo() 需要取得 |bar| 的所有权
void Foo(std::unique_ptr<Bar> bar);

...
std::unique_ptr<Bar> bar_ptr(new Bar());
Foo(std::move(bar_ptr)); // 这句执行完后，|bar_ptr| 将变成 null
Foo(std::unique_ptr<Bar>(new Bar())); // 临时对象不需要使用 std::move()
```

如果一个函数的返回值为 `std::unique_ptr` ，就意味着调用方需要接管返回值的所有权。仅在函数实际的返回值类型与定义的返回值类型不一致时才需要使用 `std::move()` 。

```cpp:title=作为返回值
class Base { ... };
class Derived : public Base { ... };

// Foo() 需要取得 |base| 的所有权，而调用方需要接管返回值的所有权
std::unique_ptr<Base> Foo(std::unique_ptr<Base> base) {
  if (cond) {
    return base; // 直接将 |base| 的所有权移交给调用方
  }

  // 注意在接下来的代码中，|base| 会在函数执行完毕时自动被删除
  if (cond2) {
    // 临时对象不需要使用 std::move()
    return std::unique_ptr<Base>(new Base()));
  }

  std::unique_ptr<Derived> derived(new Derived());

  // 由于实际的返回值类型与定义的返回值类型不一致，所以必须使用 std::move()
  return std::move(derived);
}
```

## rtc::scoped_refptr

`rtc::scoped_refptr` 基于上述约定的使用示例也比较简单，读者可以自行演绎。这里重点讲讲为什么 WebRTC（以及 Chromium）不使用 `std::shared_ptr` 。

在 WebRTC 中，如果一个类想要被引用计数，则它需要继承自 `rtc::RefCountInterface` ，并实现其中的 `AddRef()` 和 `Release()` 这两个方法：

```cpp:title=ref_count.h
class RefCountInterface {
 public:
  virtual void AddRef() const = 0;
  virtual RefCountReleaseStatus Release() const = 0;

  // Non-public destructor, because Release()
  // has exclusive responsibility for destroying the object.
 protected:
  virtual ~RefCountInterface() {}
};
```

你不需要也没有必要自己手动调用这两个方法，一切都交由 `rtc::scoped_refptr` 管理。当然你也不一定非要自己实现这两个方法，可以简单借助 `rtc::RefCountedObject` 实现：

```cpp:title=rtp_sender.cc
rtc::scoped_refptr<VideoRtpSender> VideoRtpSender::Create(
    rtc::Thread* worker_thread,
    const std::string& id,
    SetStreamsObserver* set_streams_observer) {
  // VideoRtpSender 继承自 rtc::RefCountInterface，
  // 但是并没有自己实现 AddRef() 和 Release()
  return rtc::scoped_refptr<VideoRtpSender>(
      // highlight-next-line
      new rtc::RefCountedObject<VideoRtpSender>(
          worker_thread, id, set_streams_observer));
}
```

而对于 C++ 11 的 `std::shared_ptr` 而言则完全没有类型的限制，也不需要自己实现 `AddRef()` 和 `Release()` ，是一种非入侵式（non-intrusive）的引用计数实现。与之相对应的，`rtc::scoped_refptr` 就是一种入侵式（intrusive）的引用计数实现。

之所以不使用 `std::shared_ptr`，一部分当然是历史原因，显然在 C++ 11 出现之前，`rtc::scoped_refptr` 就已经存在了。但更重要的是，`std::shared_ptr` 并没有给 WebRTC（以及 Chromium）带来显著的收益，且由于缺少了类型限制，反而会导致引用计数的滥用。

**在 C++ 中使用引用计数会导致对象所有权不够明确，析构的时机也会变得难以理解，尤其是在多线程环境中。**所以我们应该尽可能少地使用引用计数，比如尽量使用单线程模型。

WebRTC（以及 Chromium）的代码中已经存在大量的引用计数，但这不意味着你也可以随意使用引用计数。根据 [proposal: allow std::shared\_ptr and std::unique\_ptr](https://groups.google.com/a/chromium.org/g/cxx/c/aT2wsBLKvzI) 的讨论，编程人员应该在设计类的时候就决策好这个类是否可以被引用计数；如果不能被引用计数，就不要继承自 `rtc::RefCountInterface` 。

另外，笔者在查阅相关资料的过程中，看到有文章说自己实现 `Release()` 的话可以在指定线程销毁对象（这种说法在上述 proposal 中也有被提及）。但其实 `std::shared_ptr` 也是可以通过自定义 Deleter 的方式在指定线程销毁对象的，因此笔者特意在此纠正这种说法：

```cpp:title=cppreference.com
template<class Y, class Deleter>
shared_ptr(Y* ptr, Deleter d);

// 甚至还能自定义 Alloc
template<class Y, class Deleter, class Alloc>
shared_ptr(Y* ptr, Deleter d, Alloc alloc);
```

---

以上便是 WebRTC 智能指针部分的全部内容了。无论是新增、修改 WebRTC 代码，亦或是在其他 C++ 项目中使用智能指针，遵循这份指南都有助于代码的健壮性，希望大家共同学习。
