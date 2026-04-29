import axios from "axios";

// =========================
// 기본 API 인스턴스
// =========================
// axios 라이브러리를 사용하여 커스텀 설정이 적용된 'api' 인스턴스를 생성합니다.
const api = axios.create({

  // 1. 서버의 기본 주소를 설정합니다. 
  // ⭐ 변경된 부분: 로컬 주소를 주석 처리하고 배포된 Render 주소를 입력합니다.
  // baseURL: "http://localhost:8000",
  baseURL: "https://my-fastapi-backenddeploy.onrender.com", // 본인의 Render URL

  // 2. 서로 다른 도메인(Port가 달라도 포함) 간에 쿠키나 인증 정보를 주고받을 수 있게 허용합니다.
  // 특히 백엔드에서 보낸 'refresh_token' 쿠키를 브라우저가 보관하고 다시 보낼 때 반드시 true여야 합니다.
  withCredentials: true,

  // 3. 서버에 요청을 보낸 후 응답을 기다리는 최대 시간을 10,000ms(10초)로 제한합니다.
  // 10초가 지나도 응답이 없으면 에러(Timeout)를 발생시켜 무한 대기를 방지합니다.
  timeout: 10000,

});

// =========================
// refresh 전용 API (절대 interceptor 영향 없음)
// =========================
const refreshApi = axios.create({
  baseURL: "https://my-fastapi-backenddeploy.onrender.com",
  withCredentials: true,
  timeout: 10000,
});

// =========================
// access token (메모리 저장)
// =========================
let accessToken = null;

// token 저장
export const setToken = (token) => {
  accessToken = token;
};

// token 조회
export const getToken = () => accessToken;

// =========================
// 요청 인터셉터
// =========================
api.interceptors.request.use((config) => {

  //  refresh 요청은 Authorization 절대 붙이지 않음 (핵심 안정화)
  if (config.url === "/refresh") {
    return config;
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// =========================
// refresh 중복 방지
// =========================
let isRefreshing = false;
let refreshSubscribers = [];

// 대기 요청 실행
const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// 대기 등록
const addSubscriber = (cb) => {
  refreshSubscribers.push(cb);
};

// =========================
// 응답 인터셉터
// =========================
api.interceptors.response.use(
  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    // =========================
    // ❗ refresh 요청 자체는 interceptor 제외 (핵심)
    // =========================
    if (originalRequest.url === "/refresh") {
      return Promise.reject(error);
    }

    // =========================
    // 401 처리
    // =========================
    if (error.response?.status === 401) {

      // 이미 retry된 요청이면 종료
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // =========================
      // refresh 진행 중이면 queue 대기
      // =========================
      if (isRefreshing) {

        return new Promise((resolve) => {
          addSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {

        // =========================
        // refresh 요청
        // =========================
        const res = await refreshApi.post("/refresh");

        const newAccessToken = res.data.access_token;

        // token 저장
        setToken(newAccessToken);

        // queue 처리
        onRefreshed(newAccessToken);

        isRefreshing = false;

        // 현재 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (refreshError) {

        // =========================
        // refresh 실패 → 완전 초기화
        // =========================
        isRefreshing = false;
        refreshSubscribers = [];
        setToken(null);

        // 로그인 강제 이동
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;