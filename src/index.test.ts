import { describe, it, expect, vi, beforeEach } from "vitest";
import { notify, notifyBasic, notifyProgress, updateNotification, clearNotification, clearAllHandlers } from "./index";

const mockCreate = vi.fn((_id: string, _opts: any, cb: (id: string) => void) => cb(_id));
const mockUpdate = vi.fn((_id: string, _opts: any, cb: (updated: boolean) => void) => cb(true));
const mockClear = vi.fn((_id: string, cb: (cleared: boolean) => void) => cb(true));
const onClickListeners: Array<(id: string) => void> = [];
const onButtonClickListeners: Array<(id: string, idx: number) => void> = [];
const onCloseListeners: Array<(id: string, byUser: boolean) => void> = [];

const globalAny = globalThis as any;
globalAny.chrome = {
  notifications: {
    create: mockCreate,
    update: mockUpdate,
    clear: mockClear,
    onClicked: { addListener: (fn: any) => onClickListeners.push(fn) },
    onButtonClicked: { addListener: (fn: any) => onButtonClickListeners.push(fn) },
    onClosed: { addListener: (fn: any) => onCloseListeners.push(fn) },
  },
  runtime: { lastError: null },
};

describe("webext-notifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalAny.chrome.runtime.lastError = null;
    clearAllHandlers();
  });

  it("creates a basic notification", async () => {
    const id = await notify("n1", {
      type: "basic",
      title: "Hello",
      message: "World",
      iconUrl: "icon.png",
    });
    expect(id).toBe("n1");
    expect(mockCreate).toHaveBeenCalledWith("n1", expect.objectContaining({ type: "basic", title: "Hello" }), expect.any(Function));
  });

  it("creates with notifyBasic helper", async () => {
    const id = await notifyBasic("b1", "Title", "Msg", "icon.png");
    expect(id).toBe("b1");
    expect(mockCreate).toHaveBeenCalledWith("b1", expect.objectContaining({ type: "basic" }), expect.any(Function));
  });

  it("creates a progress notification", async () => {
    const id = await notifyProgress("p1", "Loading", "Please wait", "icon.png", 50);
    expect(id).toBe("p1");
    expect(mockCreate).toHaveBeenCalledWith("p1", expect.objectContaining({ type: "progress", progress: 50 }), expect.any(Function));
  });

  it("updates a notification", async () => {
    const result = await updateNotification("n1", { title: "Updated" });
    expect(result).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith("n1", expect.objectContaining({ title: "Updated" }), expect.any(Function));
  });

  it("clears a notification", async () => {
    const result = await clearNotification("n1");
    expect(result).toBe(true);
    expect(mockClear).toHaveBeenCalledWith("n1", expect.any(Function));
  });

  it("handles click events", async () => {
    const onClick = vi.fn();
    await notify("click1", { type: "basic", title: "T", message: "M", iconUrl: "i.png" }, { onClick });
    onClickListeners.forEach((fn) => fn("click1"));
    expect(onClick).toHaveBeenCalledWith("click1");
  });

  it("handles button click events", async () => {
    const onButtonClick = vi.fn();
    await notify("btn1", { type: "basic", title: "T", message: "M", iconUrl: "i.png", buttons: [{ title: "OK" }] }, { onButtonClick });
    onButtonClickListeners.forEach((fn) => fn("btn1", 0));
    expect(onButtonClick).toHaveBeenCalledWith("btn1", 0);
  });

  it("handles close events and cleans up handlers", async () => {
    const onClose = vi.fn();
    await notify("close1", { type: "basic", title: "T", message: "M", iconUrl: "i.png" }, { onClose });
    onCloseListeners.forEach((fn) => fn("close1", true));
    expect(onClose).toHaveBeenCalledWith("close1", true);
  });

  it("rejects on create error", async () => {
    globalAny.chrome.runtime.lastError = { message: "create failed" };
    mockCreate.mockImplementationOnce((_id: string, _opts: any, cb: (id: string) => void) => cb(_id));
    await expect(notify("err", { type: "basic", title: "T", message: "M", iconUrl: "i.png" })).rejects.toThrow("create failed");
  });

  it("rejects on update error", async () => {
    globalAny.chrome.runtime.lastError = { message: "update failed" };
    mockUpdate.mockImplementationOnce((_id: string, _opts: any, cb: (updated: boolean) => void) => cb(false));
    await expect(updateNotification("err", { title: "X" })).rejects.toThrow("update failed");
  });

  it("supports silent notifications", async () => {
    await notify("s1", { type: "basic", title: "T", message: "M", iconUrl: "i.png", silent: true });
    expect(mockCreate).toHaveBeenCalledWith("s1", expect.objectContaining({ silent: true }), expect.any(Function));
  });

  it("supports requireInteraction", async () => {
    await notify("ri1", { type: "basic", title: "T", message: "M", iconUrl: "i.png", requireInteraction: true });
    expect(mockCreate).toHaveBeenCalledWith("ri1", expect.objectContaining({ requireInteraction: true }), expect.any(Function));
  });

  it("supports priority levels", async () => {
    await notify("pr1", { type: "basic", title: "T", message: "M", iconUrl: "i.png", priority: 2 });
    expect(mockCreate).toHaveBeenCalledWith("pr1", expect.objectContaining({ priority: 2 }), expect.any(Function));
  });
});
