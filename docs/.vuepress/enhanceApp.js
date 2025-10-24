// .vuepress/enhanceApp.js
export default ({
  Vue, // VuePress 应用的 Vue 构造函数
  options, // 根 Vue 实例的选项
  router, // 应用的路由实例
  siteData, // 站点元数据
  isServer, // 当前脚本运行在服务端还是客户端
}) => {
  // 确保只在客户端执行
  if (!isServer) {
    // 尝试在应用挂载后稍等片刻再检查 docsearch
    setTimeout(() => {
      console.log("--- Debug DocSearch ---");
      console.log("Checking window.docsearch:", window.docsearch);

      // 尝试访问插件选项 (注意：这种方式不一定能直接访问到插件配置)
      console.log("SiteData plugins:", siteData.plugins); // siteData 不包含运行时插件配置

      // 打印完整的 siteData 看看有没有线索
      console.log("Full siteData:", siteData);

      // 如果想在这里暂停，可以取消下面这行的注释
      // debugger;
    }, 2000); // 延迟 2 秒，给 DocSearch 脚本更多加载和初始化时间
  }
};
