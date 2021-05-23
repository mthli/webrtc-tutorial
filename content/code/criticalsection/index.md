---
title: 临界锁实现
description: 在构造函数中加锁，在析构函数中解锁 🧐
ogImage: '../../assets/book.jpg'
---

在阅读 WebRTC 源码过程中，经常可以看到 `rtc::CritScope` 相关的代码调用，例如：

```cpp:title=rtp_video_sender.cc
void RtpVideoSender::SetFecAllowed(bool fec_allowed) {
  // highlight-next-line
  rtc::CritScope cs(&crit_); // rtc::CriticalSection crit_;
  fec_allowed_ = fec_allowed;
}
```

笔者目前的主力语言还不是 C++，所以第一次见到这种加锁机制还挺新鲜的。事实上笔者刚开始甚至以为这只是创建了一个 `cs` 变量，然后啥都不做，不知道这样的代码有什么意义。

但这其实是 C++ 编程的小技巧。我们先来看看 `rtc::CritScope` 的具体实现：

```cpp:title=critical_section.cc
// CritScope 只有构造函数和析构函数两个定义；
// CriticalSection 在不同平台上的实现不一样，
// 对于 POSIX 而言实现为 mutable pthread_mutex_t mutex_;
CritScope::CritScope(const CriticalSection* cs) : cs_(cs) {
  cs_->Enter(); // pthread_mutex_lock(&mutex_);
}
CritScope::~CritScope() {
  cs_->Leave(); // pthread_mutex_unlock(&mutex_);
}
```

在 C++ 中，函数内部的局部变量会在该函数退出时进行析构（不论是否有异常）。通过在局部变量的构造函数中加锁，在析构函数中解锁，可以有效创造出一段函数生命周期内的临界区，而不用撰写类似 Java ReentrantLock 的 try-finally 释放锁的冗余代码。

更进一步来说，这其实是 C++ [RAII](https://zh.cppreference.com/w/cpp/language/raii)（资源获取即初始化，**R**esource **A**cquisition **I**s **I**nitialization）机制的一种使用场景。RAII 可以保证在释放资源时不受到异常退出的影响（即使发生了异常，也能正确释放资源）；同时还能预防编码过程忘记释放资源的行为。在笔者看来，RAII 是比 Golang 的 [defer](https://gobyexample.com/defer) 机制更加简洁的存在，哈哈。
