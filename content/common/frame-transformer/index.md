---
title: 编辑视频帧
description: 在视频帧中插入自定义数据 🥪
ogImage: '../../assets/book.jpg'
---

**本文所有源码均基于 WebRTC M85 (branch-heads/4183) 版本进行分析。**

在 [视频推流过程](https://webrtc.mthli.com/connection/video-streaming-process/#%E6%B7%BB%E5%8A%A0%E6%BB%A4%E9%95%9C) 一文中笔者介绍了给视频添加滤镜的方法，是在视频帧被编码前对其进行处理。有时我们还需要在视频帧被编码后对其进行处理，插入一些自定义数据，比如插入 H.264 定义的 SEI（Supplemental Enhancement Information，补充增强信息）。

此时便可以使用 [WebRTC Insertable Streams API](https://github.com/w3c/webrtc-encoded-transform)，这组 API 在 WebRTC M83 (branch-heads/4103) 版本被引入，会分别在视频帧被编码后且发送前、或者被接收后且解码前被调用。由于笔者是 Native 开发，因此这里直接给出 C++ 代码；前端开发者则可以直接参照 W3C [对应文档](https://github.com/w3c/webrtc-encoded-transform/blob/main/explainer.md)。

首先我们需要继承并实现 `webrtc::FrameTransformerInterface` ，一个典型模版如下：

```cpp:title=ExampleTransformer.cpp
namespace example {

// 在头文件中定义
// class ExampleTransformer : public webrtc::FrameTransformerInterface {
//  public:
//   virtual void RegisterTransformedFrameSinkCallback(
//       rtc::scoped_refptr<webrtc::TransformedFrameCallback>, uint32_t ssrc) override;
//   virtual void UnregisterTransformedFrameSinkCallback(uint32_t ssrc) override;
//   virtual void Transform(std::unique_ptr<webrtc::TransformableFrameInterface> frame) override;
//  private:
//   mutable webrtc::Mutex mutex_;
//   rtc::scoped_refptr<webrtc::TransformedFrameCallback> sink_callback_;
// }

  // WebRTC 只会在 webrtc::RTPSenderVideo 的构造方法中注册一个 callback，
  // 具体可以参见 rtp_sender_video.cc frame_transformer_delegate_->Init()
  void ExampleTransformer::RegisterTransformedFrameSinkCallback(
      rtc::scoped_refptr<webrtc::TransformedFrameCallback> callback, uint32_t ssrc) {
    webrtc::MutexLock lock(&mutex_);
    sink_callback_ = callback;
  }

  void ExampleTransformer::UnregisterTransformedFrameSinkCallback(uint32_t ssrc) {
    webrtc::MutexLock lock(&mutex_);
    sink_callback_ = nullptr;
  }

  void ExampleTransformer::Transform(std::unique_ptr<webrtc::TransformableFrameInterface> frame) {
    webrtc::MutexLock lock(&mutex_);
    if (sink_callback_ == nullptr) return;

    // 在这里处理 frame 的二进制数据...
    // 处理完毕后务必调用 sink_callback_ 将帧数据传递给上层
    sink_callback_->OnTransformedFrame(std::move(frame));
  }
}
```

如果你想要在视频帧被编码后且发送前被调用，可以通过 RtpSender 进行设置：

```cpp:title=rtp_sender_interface.h
class RTC_EXPORT RtpSenderInterface : public rtc::RefCountInterface {
 public:
  // other definitions...

  // 设置的 frame_transformer 会在视频帧被编码后且发送前调用
  virtual void SetEncoderToPacketizerFrameTransformer(
      rtc::scoped_refptr<FrameTransformerInterface> frame_transformer);

  // other definitions...
}
```

如果你想要在视频帧被接收后且解码前被调用，可以通过 RtpReceiver 进行设置：

```cpp:title=rtp_receiver_interface.h
class RTC_EXPORT RtpReceiverInterface : public rtc::RefCountInterface {
 public:
  // other definitions...

  // 设置的 frame_transformer 会在视频帧被接收后且解码前被调用
  virtual void SetDepacketizerToDecoderFrameTransformer(
      rtc::scoped_refptr<FrameTransformerInterface> frame_transformer);

  // other definitions...
}
```

最后，这组 API 也同样适用于音频，因此读者需要注意 transform 过程中 frame 的具体类型。如果是视频帧数据，实际类型为 `webrtc::TransformableVideoFrameInterface` ；如果是音频帧数据，则实际类型为 `webrtc::TransformableAudioFrameInterface` 。由于笔者的项目中音视频分别是不同的 RtpSender，所以目前并没有这样的烦恼。
