import currencies from "./json/currencies.json";
import * as fs from "fs";
import * as path from "path";

// 常量定义
const HANDLER_DIR = path.join(__dirname, "handler");
const DATA_DIR = path.join(__dirname, "data");
const SUPPORTED_EXTENSIONS = [".ts", ".js"];

// 初始化数据目录
const initializeDataDir = (): void => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

// 保存数据到文件
const saveData = (fileName: string, data: ResultData): void => {
  if (!data || typeof data !== "object") {
    console.warn(`跳过保存无效数据: ${fileName}`);
    return;
  }

  const outputPath = path.join(DATA_DIR, `${fileName}.json`);
  try {
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`✅ 结果已保存到: ${outputPath}`);
  } catch (error) {
    console.error(`❌ 保存文件失败 ${fileName}:`, error);
  }
};

// 获取处理器文件列表
const getHandlerFiles = (): string[] => {
  try {
    const files = fs.readdirSync(HANDLER_DIR);
    return files.filter((file) =>
      SUPPORTED_EXTENSIONS.some((ext) => file.endsWith(ext))
    );
  } catch (error) {
    console.error("❌ 读取 handler 目录失败:", error);
    return [];
  }
};

// 执行单个处理器
const executeHandler = async (
  handlerPath: string,
  handlerName: string
): Promise<void> => {
  try {
    const handler = await import(handlerPath);

    // 执行默认导出函数
    if (handler.default && typeof handler.default === "function") {
      console.log(`🚀 执行处理器: ${handlerName}`);
      const result = await handler.default(currencies);
      saveData(handlerName, result);
      return;
    }

    // 执行 exec 函数
    if (handler.exec && typeof handler.exec === "function") {
      console.log(`🚀 执行处理器: ${handlerName}.exec`);
      const result = await handler.exec(currencies);
      saveData(handlerName, result);
      return;
    }

    console.warn(`⚠️  处理器 ${handlerName} 没有可执行的函数`);
  } catch (error) {
    console.error(`❌ 执行处理器 ${handlerName} 失败:`, error);
  }
};

// 查找目标文件
const findTargetFile = (fileName: string): string | null => {
  // 如果已经有扩展名，直接检查
  if (SUPPORTED_EXTENSIONS.some((ext) => fileName.endsWith(ext))) {
    return fs.existsSync(path.join(HANDLER_DIR, fileName)) ? fileName : null;
  }

  // 尝试添加扩展名查找
  for (const ext of SUPPORTED_EXTENSIONS) {
    const fileWithExt = `${fileName}${ext}`;
    if (fs.existsSync(path.join(HANDLER_DIR, fileWithExt))) {
      return fileWithExt;
    }
  }

  return null;
};

// 加载并执行所有处理器
const loadAndExecuteHandlers = async (): Promise<void> => {
  console.log("🔍 扫描所有处理器...");

  const handlerFiles = getHandlerFiles();

  if (handlerFiles.length === 0) {
    console.log("📭 未找到任何处理器文件");
    return;
  }

  console.log(`📦 找到 ${handlerFiles.length} 个处理器文件`);

  for (const file of handlerFiles) {
    const handlerPath = path.join(HANDLER_DIR, file);
    const handlerName = path.basename(file, path.extname(file));
    await executeHandler(handlerPath, handlerName);
  }

  console.log("✨ 所有处理器执行完成");
};

// 执行指定文件名称的处理器
const executeSpecificHandler = async (fileName: string): Promise<void> => {
  console.log(`🎯 查找处理器: ${fileName}`);

  const targetFile = findTargetFile(fileName);

  if (!targetFile) {
    console.error(`❌ 未找到处理器文件: ${fileName}`);
    return;
  }

  const handlerPath = path.join(HANDLER_DIR, targetFile);
  const handlerName = path.basename(targetFile, path.extname(targetFile));

  await executeHandler(handlerPath, handlerName);
};

// 主函数
const main = async (): Promise<void> => {
  console.log("🚀 启动汇率处理器");

  initializeDataDir();

  const args = process.argv.slice(2);
  console.log("📝 命令行参数:", args);

  try {
    if (args.length > 0) {
      // 执行指定的处理器
      const fileName = args[0];
      console.log(`🎯 执行指定处理器: ${fileName}`);
      await executeSpecificHandler(fileName!);
    } else {
      // 执行所有处理器
      console.log("📊 执行所有处理器");
      await loadAndExecuteHandlers();
    }
  } catch (error) {
    console.error("💥 程序执行失败:", error);
    process.exit(1);
  }

  console.log("🎉 程序执行完成");
  process.exit(0);
};

// 启动程序
main();
