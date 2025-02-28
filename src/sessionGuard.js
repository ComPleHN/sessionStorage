// sessionGuard.js
const SESSION_KEY = '__session_guard__';

function defineSessionGuard(key, fetcher) {
  const storageKey = `__${key}_session__`;
  
  // 单例处理
  if (window[SESSION_KEY]) {
    window[SESSION_KEY] = {};
  }
  
  const instance = {
    async get() {
      try {
        const raw = sessionStorage.getItem(storageKey);
        if (!raw) return this.fetchFresh();
        
        sessionStorage.removeItem(storageKey); // 无论成功与否都删除
        const decoded = atob(raw);
        return JSON.parse(decoded);
      } catch {
        return this.fetchFresh();
      }
    },

    async fetchFresh() {
      const data = await fetcher();
      this.write(data);
      return data;
    },

    write(data) {
        console.log('写入数据到sessionStorage',data);
        
      const encoded = btoa(JSON.stringify(data));
      sessionStorage.setItem(storageKey, encoded);
    }
  };

  window[SESSION_KEY] = { [key]: instance };
  return instance;
}

if (typeof window !== 'undefined') {
  window.defineSessionGuard = defineSessionGuard; 
}
// export { defineSessionGuard };