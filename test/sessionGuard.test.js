// sessionGuard.test.js
import { defineSessionGuard } from '../src/sessionGuard';

describe('sessionGuard', () => {
    beforeEach(() => {
        sessionStorage.clear();
        window.__session_guard__ = {};
    });

    test('正常获取流程', async () => {
        const mockFetch = jest.fn()
            .mockResolvedValueOnce({ id: 1 })
            .mockResolvedValueOnce({ id: 2 });

        const guard = defineSessionGuard('user', mockFetch);

        // 第一次调用（无缓存）
        const data1 = await guard.get();
        expect(data1).toEqual({ id: 1 });
        expect(sessionStorage.getItem('__user_session__')).toBeTruthy();
        expect(mockFetch).toBeCalledTimes(1);

        // 第二次调用（有缓存）
        const data2 = await guard.get();
        expect(data2).toEqual({ id: 1 });
        expect(sessionStorage.getItem('__user_session__')).toBeNull();
        expect(mockFetch).toBeCalledTimes(1);

        // 第三次调用（缓存已删除）
        const data3 = await guard.get();
        expect(data3).toEqual({ id: 2 });
        expect(mockFetch).toBeCalledTimes(2);
    });

    test('解码失败回退', async () => {
        sessionStorage.setItem('__user_session__', 'INVALID_BASE64_STRING');
        const mockFetch = jest.fn().mockResolvedValue({ id: 999 });
        const guard = defineSessionGuard('user', mockFetch);

        const data = await guard.get();

        expect(data).toEqual({ id: 999 });
        expect(mockFetch).toBeCalledTimes(1);
        expect(sessionStorage.getItem('__user_session__')).toEqual(
            btoa(JSON.stringify({ id: 999 }))
        );
    });

    test('单例覆盖', () => {
        defineSessionGuard('test1', () => { });
        defineSessionGuard('test2', () => { });
        expect(Object.keys(window.__session_guard__)).toEqual(['test2']);
    });

    test('写入加密', () => {
        const guard = defineSessionGuard('user', () => { });
        guard.write({ name: 'John' });
        const raw = sessionStorage.getItem('__user_session__');
        expect(raw).toBe(btoa(JSON.stringify({ name: 'John' })));
    });
});
