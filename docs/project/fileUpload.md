# 前端大文件上传

- 功能
  - 分片，断点续传、暂停/继续/取消、进度条、并发上传、自动重试、断点恢复等
- 技术栈
  - 前端：Next.js（App Router）、Ant Design（UI）、TypeScript
  - 通信：fetch+FormData
  - 后端：Next.js API 路由，Node.js 文件操作

## 初始实现：基础上传与进度条

- 实现目标
  - 完成基础的文件上传功能，为后续扩展打好基础。
  - 提供文件上传入口，上传后能获得文件访问链接。
  - UI 能反馈上传进度（最初用模拟进度）。
- 前端实现
  - 使用 Ant Design 的 Upload 组件，触发上传操作。
  - 利用 beforeUpload 拦截文件，实现自定义上传逻辑。
  - 进度条组件展示上传进度，最初阶段可简单模拟。
  - 关键代码片段：
    ```tsx
    <Upload
      showUploadList={false}
      beforeUpload={beforeUpload}
      maxCount={1}
    >
      <Button icon={<UploadOutlined />}>上传文件</Button>
    </Upload>
    <Progress percent={progress} />
    ```
- 后端实现
  - 提供 `/api/upload` POST 接口，支持 multipart/form-data。
  - 文件直接保存到 `public/uploads` 目录。
  - 返回上传后文件的 URL 供前端展示。
  - 关键代码片段（省略部分细节）：
    ```typescript
    export async function POST(req: NextRequest) {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      const fileName = formData.get("fileName") as string;
      if (file && fileName) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await fs.writeFile(filePath, buffer);
        const fileUrl = `/uploads/${fileName}`;
        return NextResponse.json({ url: fileUrl });
      }
      return NextResponse.json({ error: "参数不全" }, { status: 400 });
    }
    ```
- 知识点与扩展
  - Ant Design 的 Upload 组件自带 UI 体验好，但大文件上传、断点等高级功能需自定义。
  - fetch+FormData 适合现代浏览器环境，便于后续扩展分片上传。
  - 进度条初始实现可直接受控于上传事件，后续可与分片进度结合。

## 分片上传与真实进度

- 目标
  - 解决大文件上传问题，防止浏览器内存溢出和网络异常导致的上传失败。
  - 进度条要能真实反映上传进度。
- 实现细节
  - 前端将文件按固定大小（如 2MB）切片，每个分片单独上传。
  - 分片进度通过“已上传分片数/总分片数”计算，进度条实时反馈。
  - 分片上传可采用串行或并发，后续实现并发。
  - 关键代码片段：
    ```typescript
    const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const chunk = file.slice(start, end);
    // 分片上传
    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("fileId", fileId);
    formData.append("chunkIndex", chunkIndex.toString());
    formData.append("totalChunks", totalChunks.toString());
    ```
- 后端支持
  - 每个分片单独存储，目录结构为 public/uploads/chunks/${fileId}/${chunkIndex}
  - 提供合并接口，前端上传完毕后通知后端合并为完整文件。
- 知识点与扩展
  - `File.slice` 支持大文件切割，浏览器兼容性好。
  - 分片上传能显著提升大文件上传的可靠性和容错性。
  - 进度条以分片为单位更真实，便于处理重试/断点等场景。

## 断点续传与分片管理

- 目标
  - 支持断点续传，保证上传失败/刷新后可以继续，提升用户体验和资源利用率。
- 实现细节
  - 上传前先询问后端哪些分片已上传，避免重复上传。
  - 上传进度实时保存到 localStorage，刷新后可恢复状态。
  - 上传完成后，前端发起合并请求，后端负责合并分片并清理临时目录。
  - 关键代码片段：
    ```typescript
    // 查询已上传分片
    async function getUploadedChunks(fileId: string) { ... }
    // 保存断点到 localStorage
    localStorage.setItem(
      `upload_${fileId}`,
      JSON.stringify({
        fileName: file.name,
        fileSize: file.size,
        totalChunks,
        uploadedChunks: Array.from(finishedSet),
      })
    );
    ```
  - 后端 GET `/api/upload?fileId=...` 返回已上传分片索引数组，POST 支持单分片上传。
- 知识点与扩展
  - 利用 localStorage 记录断点，前端可随时恢复上传状态。
  - 分片上传与断点续传方案配合能极大提高大文件上传的可用性。
  - 分片索引同步保证前后端一致，防止分片丢失。

## 暂停、继续、取消与并发上传

- 目标
  - 支持用户在上传过程中随时暂停、继续或取消，提升灵活性。
  - 支持多个分片并发上传，提高带宽利用率和上传速度。
  - 分片上传失败可自动重试，增强健壮性。
- 实现细节

  - 每个分片上传都配备独立的 AbortController，便于单独中断。
  - 暂停操作：调用 controller.abort() 终止所有正在上传的分片，暂停新分片上传。
  - 继续操作：检测断点信息，恢复未完成分片上传。
  - 取消操作：清理本地 localStorage 和后端临时分片，重置 UI 状态。
  - 控制最大并发数（如 3），通过 activeCount 计数器控制上传队列。
  - 分片失败自动重试最多 3 次，防止临时网络波动导致整体失败。
  - 关键代码片段：

    ```typescript
    // 暂停
    setPaused(true);
    pausedRef.current = true;
    Object.values(uploadTasksRef.current).forEach((controller) => controller.abort());

    // 并发上传核心
    while (activeCount < MAX_CONCURRENT && nextChunk < totalChunks) {
      const controller = new AbortController();
      uploadTasksRef.current[chunkIndex] = controller;
      uploadChunkWithRetry(..., controller, ...)
    }
    ```

- 知识点与扩展
  - AbortController 能精准控制 fetch 请求，适合中断分片上传。
  - 并发上传要平衡速度与资源占用，避免过高并发带来带宽/服务器压力。
  - 自动重试机制是应对分片级别短暂失败的最佳实践。

## 断点恢复与刷新恢复

- 目标
  - 页面刷新后能自动检测未完成的上传任务，并提示用户继续上传。
- 实现细节
  - localStorage 记录每个上传任务的 fileId、fileName、fileSize、已上传分片索引等信息。
  - 页面加载时检测 localStorage，若存在断点信息则展示断点恢复 UI，要求用户选择同名同大小文件继续上传。
  - 恢复上传时校验文件名、大小是否一致，防止上传错误文件。
  - 关键代码片段：
    ```typescript
    function detectPendingResume() {
      if (typeof window === "undefined") return null;
      // 遍历 localStorage 查找断点
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("upload_")) {
          // ...判断有效断点
          return {...}
        }
      }
      return null;
    }
    ```
    ```tsx
    {
      pendingResume && !uploading && !paused && (
        <div>
          <Progress percent={resumeProgress} />
          <Button onClick={() => fileInputRef.current?.click()}>
            请选择文件以继续上传
          </Button>
          <Button onClick={handleAbandonResume}>放弃断点</Button>
        </div>
      );
    }
    ```
- 知识点与扩展
  - localStorage 断点检测需 SSR 兼容，避免 window 未定义报错。
  - 文件名、大小的严格校验，防止断点恢复时上传非原文件。
  - UI 友好提示，提升用户体验。

## 代码结构优化与关注点分离

- 目标
  - 提升代码可维护性和可扩展性，便于团队协作和后期优化。
- 实现细节

  - 工具函数、分片上传核心、断点检测、UI 渲染等分区明确。
  - 组件内部只关注 UI 和状态管理，逻辑和工具函数外置。
  - 变量命名清晰，添加关键注释，降低后续维护成本。
  - 关键结构示例：

    ```typescript
    // ========== 工具函数 ==========
    // getFileId, getUploadedChunks, mergeChunks ...

    // ========== 分片上传核心逻辑 ==========
    // concurrentUploadChunks, uploadChunkWithRetry ...

    // ========== 断点检测工具 ==========
    // detectPendingResume ...

    // ========== 组件 ==========
    export default function UpLoadFile() { ... }
    ```

- 知识点与扩展
  - 关注点分离（Separation of Concerns）是可扩展项目的基础。
  - 工具函数、核心逻辑与 UI 完全解耦，方便单元测试和多人协作。

## fetch 方案统一与体验细节

- 目标
  - 所有分片上传统一用 fetch，便于前端统一管理和后续扩展。
- 实现细节
  - 使用 fetch+FormData 进行分片上传，统一所有上传请求格式。
  - 进度条以“分片数量进度”模拟，兼容 fetch 的进度不可控问题。
  - 保留自动重试、断点续传等所有功能。
  - 关键代码片段：
    ```typescript
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    ```
- 知识点与扩展
  - fetch API 现代浏览器支持好，适合数据流式传输。
  - 进度条用分片进度模拟，实际体验与 xhr 基于事件的进度类似。
  - fetch 信号机制适合实现暂停/取消。

## 常见问题与最终优化

- localStorage is not defined
  - SSR 阶段 window 不存在，需用 typeof window !== 'undefined' 判断，避免首屏报错。
  - 代码示例：
    ```typescript
    if (typeof window === "undefined") return null;
    ```
- Hydration failed
  - localStorage 检查逻辑放到 useEffect，pendingResume 初始为 null，解决 SSR/CSR 不一致导致的 React Hydration 报错。
- 断点假提示
  - 上传成功后同步清理 localStorage 和 UI 状态，避免断点“假提示”误导用户。
- 其他体验细节
  - 进度条下方增加暂停说明提示。
  - 断点提示区域直观显示文件名、大小。
  - 使用 messageApi 消息防堆叠，防止多次弹窗影响体验。
- 知识点与扩展
  - SSR/CSR 兼容是 Next.js 项目常见难点，需特别注意状态的初始化时机。
  - 状态与 UI 一致性管理，用户体验优化细节。

## 最终版代码的核心知识点

- 分片切割与唯一标识
  - 利用 fileName+fileSize 生成唯一 fileId，保证断点和分片管理准确。
    ```typescript
    function getFileId(file: File) {
      return `${file.name}-${file.size}`;
    }
    ```
- 分片并发上传与自动重试
  - 见 concurrentUploadChunks、uploadChunkWithRetry，实现并发和失败重试。
- 断点检测与 localStorage 管理
  - 见 detectPendingResume 和分片进度本地持久化。
- 状态流转：暂停/继续/取消/放弃断点
  - handlePause、handleResume、handleCancel、handleAbandonResume 各自负责一类状态转换，避免混乱。
- 合并分片与后端协作
  - 前端上传完毕后调用合并接口，后端合并分片生成最终文件。
    ```typescript
    async function mergeChunks(
      fileId: string,
      fileName: string,
      totalChunks: number
    ) {
      await fetch("/api/upload/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, fileName, totalChunks }),
      });
    }
    ```
- SSR/CSR 兼容与 hydration 问题规避
  - 所有 window/localStorage 操作均在 useEffect 和客户端执行，保证一致性。
- 关注点分离与代码结构优化
  - 工具函数、分片上传核心、断点检测、UI 渲染完全独立，便于维护和扩展。

## 完整代码示例

```TSX
//src\app\(upload)\UpLoadFile
"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Button, Progress, Modal } from "antd";
import { message } from "antd";
import {
  UploadOutlined,
  PauseOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

// ========== 常量 ==========
const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_CONCURRENT = 3;

// ========== 工具函数 ==========
function getFileId(file: File) {
  return `${file.name}-${file.size}`;
}

async function getUploadedChunks(fileId: string) {
  const res = await fetch(`/api/upload?fileId=${encodeURIComponent(fileId)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.uploadedChunks || [];
}

async function mergeChunks(
  fileId: string,
  fileName: string,
  totalChunks: number
) {
  const res = await fetch("/api/upload/merge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileId, fileName, totalChunks }),
  });
  if (!res.ok) throw new Error("合并失败");
  return await res.json();
}

// ========== 分片上传核心逻辑 ==========
async function concurrentUploadChunks(
  file: File,
  fileId: string,
  totalChunks: number,
  uploadedChunks: number[],
  onProgress: (percent: number) => void,
  pausedRef: { current: boolean },
  canceledRef: { current: boolean },
  uploadTasksRef: React.RefObject<{ [key: number]: AbortController }>
): Promise<void> {
  let nextChunk = 0;
  const finishedSet = new Set<number>(uploadedChunks);
  let progressArr = Array(totalChunks).fill(0);

  function saveProgress() {
    localStorage.setItem(
      `upload_${fileId}`,
      JSON.stringify({
        fileName: file.name,
        fileSize: file.size,
        totalChunks,
        uploadedChunks: Array.from(finishedSet),
      })
    );
  }

  return new Promise<void>((resolve, reject) => {
    let activeCount = 0;
    let error: any = null;

    function uploadNext() {
      if (canceledRef.current || pausedRef.current || error) return;
      if (finishedSet.size === totalChunks) {
        saveProgress();
        onProgress(100);
        resolve();
        return;
      }
      while (activeCount < MAX_CONCURRENT && nextChunk < totalChunks) {
        if (finishedSet.has(nextChunk)) {
          progressArr[nextChunk] = 100;
          onProgress(Math.round((finishedSet.size / totalChunks) * 100));
          nextChunk++;
          continue;
        }
        const chunkIndex = nextChunk++;
        activeCount++;
        const controller = new AbortController();
        uploadTasksRef.current[chunkIndex] = controller;
        uploadChunkWithRetry(
          file,
          chunkIndex,
          fileId,
          totalChunks,
          controller,
          (percent: number) => {
            progressArr[chunkIndex] = percent;
            const totalPercent = Math.round(
              (finishedSet.size / totalChunks) * 100
            );
            onProgress(totalPercent);
          }
        )
          .then(() => {
            delete uploadTasksRef.current[chunkIndex];
            progressArr[chunkIndex] = 100;
            finishedSet.add(chunkIndex);
            saveProgress();
            onProgress(Math.round((finishedSet.size / totalChunks) * 100));
            activeCount--;
            uploadNext();
          })
          .catch(() => {
            delete uploadTasksRef.current[chunkIndex];
            activeCount--;
            uploadNext();
          });
      }
    }
    uploadNext();
  });
}

function uploadChunkWithRetry(
  file: File,
  chunkIndex: number,
  fileId: string,
  totalChunks: number,
  controller: AbortController,
  onChunkProgress: (percent: number) => void,
  retry = 0
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    const start = chunkIndex * CHUNK_SIZE;
    const end = Math.min(file.size, start + CHUNK_SIZE);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("fileId", fileId);
    formData.append("chunkIndex", chunkIndex.toString());
    formData.append("totalChunks", totalChunks.toString());
    formData.append("fileName", file.name);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      if (res.ok) {
        onChunkProgress(100);
        resolve();
      } else {
        if (retry < 3) {
          setTimeout(() => {
            uploadChunkWithRetry(
              file,
              chunkIndex,
              fileId,
              totalChunks,
              controller,
              onChunkProgress,
              retry + 1
            )
              .then(resolve)
              .catch(reject);
          }, 500);
        } else {
          reject(new Error(`分片${chunkIndex}上传失败`));
        }
      }
    } catch (e: any) {
      if (controller.signal.aborted) {
        reject(new Error("abort"));
      } else if (retry < 3) {
        setTimeout(() => {
          uploadChunkWithRetry(
            file,
            chunkIndex,
            fileId,
            totalChunks,
            controller,
            onChunkProgress,
            retry + 1
          )
            .then(resolve)
            .catch(reject);
        }, 500);
      } else {
        reject(new Error(`分片${chunkIndex}上传失败`));
      }
    }
  });
}

// ========== 断点检测工具 ==========
function detectPendingResume() {
  if (typeof window === "undefined") return null;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("upload_")) {
      try {
        const info = JSON.parse(localStorage.getItem(key)!);
        if (info && info.fileName && info.totalChunks && info.fileSize) {
          return {
            fileId: key.replace("upload_", ""),
            fileName: info.fileName,
            fileSize: info.fileSize,
            totalChunks: info.totalChunks,
            uploadedChunks: info.uploadedChunks || [],
            progress: Math.round(
              ((info.uploadedChunks?.length || 0) / info.totalChunks) * 100
            ),
          };
        }
      } catch {}
    }
  }
  return null;
}

// ========== 组件 ==========
export default function UpLoadFile() {
  // UI状态
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  // 断点相关
  const [pendingResume, setPendingResume] =
    useState<ReturnType<typeof detectPendingResume>>(null);
  useEffect(() => {
    setPendingResume(detectPendingResume());
  }, []);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 上传上下文
  const uploadContext = useRef<{
    file: File;
    fileId: string;
    totalChunks: number;
    nextChunk: number;
  } | null>(null);

  // 分片上传相关ref
  const uploadTasksRef = useRef<{ [key: number]: AbortController }>({});
  const pausedRef = useRef(false);
  const canceledRef = useRef(false);

  // 断点恢复时的进度
  const resumeProgress = pendingResume?.progress || 0;

  // 断点文件选择
  const handleResumeFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file && pendingResume) {
      if (
        file.name === pendingResume.fileName &&
        file.size === pendingResume.fileSize
      ) {
        await beforeUpload(file);
        setPendingResume(null);
      } else {
        messageApi.open({
          type: "error",
          content: "请选择与上次未完成上传相同的文件",
        });
      }
    }
  };

  // 暂停/继续控制
  const handlePause = () => {
    setPaused(true);
    pausedRef.current = true;
    Object.values(uploadTasksRef.current).forEach((controller) =>
      controller.abort()
    );
  };
  const handleResume = async () => {
    setPaused(false);
    pausedRef.current = false;
    if (currentFile && uploadContext.current) {
      await continueUpload();
    }
  };

  // 取消上传
  const handleCancel = async () => {
    canceledRef.current = true;
    setPaused(false);
    pausedRef.current = false;
    setUploading(false);
    setProgress(0);
    setCurrentFile(null);
    if (uploadContext.current) {
      const { fileId } = uploadContext.current;
      await fetch(`/api/upload?fileId=${encodeURIComponent(fileId)}`, {
        method: "DELETE",
      });
      localStorage.removeItem(`upload_${fileId}`);
    }
    messageApi.open({
      type: "success",
      content: "取消上传成功",
    });
  };

  // 分片上传主逻辑
  const beforeUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);
    setFileUrl(null);
    setFileType(null);
    setPaused(false);
    pausedRef.current = false;
    canceledRef.current = false;
    setCurrentFile(file);

    const fileId = getFileId(file);
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    uploadContext.current = { file, fileId, totalChunks, nextChunk: 0 };

    // 读取localStorage断点
    let uploadedChunks = [];
    const saved = localStorage.getItem(`upload_${fileId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          parsed.fileName === file.name &&
          parsed.fileSize === file.size &&
          parsed.totalChunks === totalChunks
        ) {
          uploadedChunks = parsed.uploadedChunks || [];
        }
      } catch {}
    } else {
      uploadedChunks = await getUploadedChunks(fileId);
    }

    try {
      await concurrentUploadChunks(
        file,
        fileId,
        totalChunks,
        uploadedChunks,
        setProgress,
        pausedRef,
        canceledRef,
        uploadTasksRef
      );
      // 合并
      const res = await mergeChunks(fileId, file.name, totalChunks);
      setFileUrl(res.url);
      setFileType(file.type);
      setCurrentFile(null);
      localStorage.removeItem(`upload_${fileId}`);
      setPendingResume(null);
    } catch (e) {
      if (!canceledRef.current) {
        await fetch(`/api/upload?fileId=${encodeURIComponent(fileId)}`, {
          method: "DELETE",
        });
        messageApi.open({
          type: "error",
          content: "上传失败",
        });
        localStorage.removeItem(`upload_${fileId}`);
      }
    } finally {
      if (!pausedRef.current && !canceledRef.current) {
        setUploading(false);
      }
    }
    return false;
  };

  // 继续上传
  const continueUpload = async () => {
    if (!uploadContext.current) return;
    setUploading(true);
    setPaused(false);
    pausedRef.current = false;
    canceledRef.current = false;

    const { file, fileId, totalChunks, nextChunk } = uploadContext.current;
    let uploadedChunks = [];
    const saved = localStorage.getItem(`upload_${fileId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          parsed.fileName === file.name &&
          parsed.fileSize === file.size &&
          parsed.totalChunks === totalChunks
        ) {
          uploadedChunks = parsed.uploadedChunks || [];
        }
      } catch {}
    } else {
      uploadedChunks = await getUploadedChunks(fileId);
    }

    try {
      await concurrentUploadChunks(
        file,
        fileId,
        totalChunks,
        uploadedChunks,
        setProgress,
        pausedRef,
        canceledRef,
        uploadTasksRef
      );
      // 合并
      const res = await mergeChunks(fileId, file.name, totalChunks);
      setFileUrl(res.url);
      setFileType(file.type);
      setCurrentFile(null);
      localStorage.removeItem(`upload_${fileId}`);
      setPendingResume(null);
    } catch (e) {
      await fetch(`/api/upload?fileId=${encodeURIComponent(fileId)}`, {
        method: "DELETE",
      });
      messageApi.open({
        type: "error",
        content: "上传失败",
      });
      localStorage.removeItem(`upload_${fileId}`);
    } finally {
      if (!pausedRef.current && !canceledRef.current) {
        setUploading(false);
      }
    }
  };

  // 放弃断点
  const handleAbandonResume = async () => {
    if (pendingResume) {
      await fetch(
        `/api/upload?fileId=${encodeURIComponent(pendingResume.fileId)}`,
        {
          method: "DELETE",
        }
      );
      localStorage.removeItem(`upload_${pendingResume.fileId}`);
      setPendingResume(null);
    }
  };

  // ========== UI渲染 ==========
  return (
    <div>
      {contextHolder}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleResumeFileSelect}
      />
      {pendingResume && !uploading && !paused && (
        <div style={{ marginBottom: 20 }}>
          <Progress percent={resumeProgress} />
          <Button
            type="primary"
            onClick={() => fileInputRef.current?.click()}
            style={{ marginLeft: 8 }}
          >
            请选择文件以继续上传
          </Button>
          <Button
            danger
            onClick={handleAbandonResume}
            style={{ marginLeft: 8 }}
          >
            放弃断点
          </Button>
        </div>
      )}
      <Upload
        showUploadList={false}
        beforeUpload={beforeUpload}
        maxCount={1}
        disabled={uploading && !paused}
      >
        <Button icon={<UploadOutlined />} disabled={uploading && !paused}>
          上传文件
        </Button>
      </Upload>
      <div style={{ marginTop: 20 }}>
        {(uploading || paused) && (
          <>
            <Progress percent={progress} />
            {!paused ? (
              <Button
                icon={<PauseOutlined />}
                onClick={handlePause}
                style={{ marginLeft: 8 }}
              >
                暂停
              </Button>
            ) : (
              <Button
                icon={<PlayCircleOutlined />}
                onClick={handleResume}
                style={{ marginLeft: 8 }}
              >
                继续
              </Button>
            )}
            <Button danger onClick={handleCancel} style={{ marginLeft: 8 }}>
              取消上传
            </Button>
            <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
              暂停将在当前分片上传完成后生效
            </div>
          </>
        )}
        {!uploading && !paused && fileUrl && fileType?.startsWith("audio/") && (
          <audio src={fileUrl} controls style={{ width: 300 }} />
        )}
        {!uploading && !paused && fileUrl && fileType?.startsWith("video/") && (
          <video src={fileUrl} controls style={{ width: 300 }} />
        )}
      </div>
    </div>
  );
}

```

```TS
// src\app\api\upload\route.ts

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// 分片临时存储目录
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "chunks");

// 工具：确保目录存在
async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

// 工具：获取分片文件路径
function getChunkPath(fileId: string, chunkIndex: string) {
  return path.join(UPLOAD_DIR, fileId, chunkIndex);
}

// 工具：获取分片目录
function getChunkDir(fileId: string) {
  return path.join(UPLOAD_DIR, fileId);
}

// 工具：获取最终文件路径
function getFinalFilePath(fileName: string) {
  return path.join(process.cwd(), "public", "uploads", fileName);
}

// GET: 查询已上传分片
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("fileId");
  if (!fileId) {
    return NextResponse.json({ uploadedChunks: [] });
  }
  const chunkDir = getChunkDir(fileId);
  try {
    const files = await fs.readdir(chunkDir);
    // 返回已上传分片的索引数组
    const uploadedChunks = files.map((name) => Number(name)).filter((n) => !isNaN(n));
    return NextResponse.json({ uploadedChunks });
  } catch {
    return NextResponse.json({ uploadedChunks: [] });
  }
}

// POST: 接收单个分片
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const fileId = formData.get("fileId") as string;
  const chunkIndex = formData.get("chunkIndex") as string;
  // 兼容普通上传
  const fileName = formData.get("fileName") as string;

  if (!file || !fileId || !chunkIndex) {
    // 普通上传
    if (file && fileName) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await ensureDir(uploadDir);
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);
      const fileUrl = `/uploads/${fileName}`;
      return NextResponse.json({ url: fileUrl });
    }
    return NextResponse.json({ error: "参数不全" }, { status: 400 });
  }

  // 分片上传
  const chunkDir = getChunkDir(fileId);
  await ensureDir(chunkDir);
  const chunkPath = getChunkPath(fileId, chunkIndex);
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await fs.writeFile(chunkPath, buffer);

  return NextResponse.json({ success: true });
}

// DELETE: 删除分片目录
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("fileId");
  if (!fileId) {
    return NextResponse.json({ error: "缺少fileId" }, { status: 400 });
  }
  const chunkDir = getChunkDir(fileId);
  try {
    await fs.rm(chunkDir, { recursive: true, force: true });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}

```

```TS
// src\app\api\upload\merge\route.ts
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "chunks");

function getChunkDir(fileId: string) {
  return path.join(UPLOAD_DIR, fileId);
}
function getFinalFilePath(fileName: string) {
  return path.join(process.cwd(), "public", "uploads", fileName);
}

export async function POST(req: NextRequest) {
  const { fileId, fileName, totalChunks } = await req.json();

  if (!fileId || !fileName || !totalChunks) {
    return NextResponse.json({ error: "参数不全" }, { status: 400 });
  }

  const chunkDir = getChunkDir(fileId);
  const finalPath = getFinalFilePath(fileName);

  try {
    // 合并所有分片
    const writeStream = await fs.open(finalPath, "w");
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(chunkDir, String(i));
      const data = await fs.readFile(chunkPath);
      await writeStream.write(data);
    }
    await writeStream.close();

    // 删除分片目录
    await fs.rm(chunkDir, { recursive: true, force: true });

    const fileUrl = `/uploads/${fileName}`;
    return NextResponse.json({ url: fileUrl });
  } catch (e) {
    return NextResponse.json({ error: "合并失败" }, { status: 500 });
  }
}

```
