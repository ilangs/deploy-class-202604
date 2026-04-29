import api from "./axios";

// 회원가입 API
export const register = (data) => {
  return api.post("/register", data); // POST /register 호출
};

// =========================
// 로그인 API 호출 및 응답 처리
// =========================
export const login = async (data) => {

  // 1. 서버(FastAPI)의 /login 엔드포인트로 사용자가 입력한 데이터(이메일, 비번)를 보냅니다.
  // 성공 시 서버는 access_token과 유저 정보를 담은 JSON을 응답합니다.
  const res = await api.post("/login", data);

  // 2. 받은 액세스 토큰을 세션 스토리지(sessionStorage)에 저장합니다.
  // localStorage와 달리 브라우저 탭을 닫으면 데이터가 삭제되어 보안상 조금 더 유리합니다.
  sessionStorage.setItem("access_token", res.data.access_token);

  // 3. JWT의 구조는 [헤더].[페이로드].[서명] 형태입니다.
  // 이 중 중간 부분인 페이로드(index 1번)를 추출하여 Base64로 디코딩(atob)합니다.
  // 디코딩된 문자열을 JSON 객체로 변환(JSON.parse)하여 데이터를 읽기 쉽게 만듭니다.
  const payload = JSON.parse(atob(res.data.access_token.split(".")[1]));

  // 4. 토큰의 'sub'(subject) 필드에 담긴 user_id(사용자 고유 번호)를 꺼내 저장합니다.
  // 이후 게시글 수정/삭제 시 "내가 쓴 글인가?"를 판단하는 권한 체크용으로 사용됩니다.
  sessionStorage.setItem("user_id", payload.sub);

  // 5. 최종적으로 서버로부터 받은 전체 데이터를 반환합니다.
  return res.data;
};