# [하나1QCT] - MZ세대를 위한 SIMPLE&SAFE 플랫폼

#### 2024 하나금융티아이 채용연계형 교육 최종프로젝트

# 1. 프로젝트 기획서

### 1-1. 프로젝트 기획 배경
![스크린샷 2024-10-07 13 22 43](https://github.com/user-attachments/assets/6096b094-9c06-45c7-a06e-83c119db45ce)
 <br/>
![스크린샷 2024-10-07 13 23 10](https://github.com/user-attachments/assets/e2872d6a-4ea9-46e2-88af-9866708cbb84)
 <br/>

- 최근 MZ세대 투자자수 감소
- MZ세대 미래자산 5배이상 확대 예상
- MZ세대를 고객으로 확보하기 위한 중요성을 인지 후 안정성과 간편성을 높인 주식거래 플랫폼 기획

### 1-2. 서비스 소개
![스크린샷 2024-10-11 13 30 29](https://github.com/user-attachments/assets/b8dddc51-8665-4e58-b470-2bf024d5cf4b)

 <br/>

### 1-3. 서비스 아키텍처
![스크린샷 2024-10-07 13 23 30](https://github.com/user-attachments/assets/48efa977-9bce-4fe6-9dcb-6ec73c0f17da)

 <br/>

- 투자 정보관리 시스템
- 실제 국내주식, 해외주식 매매 가능
- 가상 오픈뱅킹으로 이체기능

### 1-4. 장점 및 기대효과
![스크린샷 2024-10-07 13 23 37](https://github.com/user-attachments/assets/0ce9d643-a093-4a54-be3e-df481fcbb8b7)

 <br/>

# 2. 프로젝트 응용 기술 개요

### 2-1. 개발환경
<img width="1440" alt="image" src="https://github.com/user-attachments/assets/88d60194-21a9-44fb-9a3b-d6af45071e97">

 <br/>

### 2-2. 시스템 아키텍처
<img width="1191" alt="스크린샷 2024-10-11 09 19 32" src="https://github.com/user-attachments/assets/57c87da2-4681-4b70-b8ff-d696deeb7c4c">

<br/>

- 전체 시스템은 하나1QCT를 중심으로 오픈뱅킹 서비스 개발
- 모든 시스템은 AWS 클라우드 가상머신에 배포
- 모든 데이터는 AWS RDS에 배포
- AWS CloudFront를 활용하여 하나1QCT로 리다이렉트
- 하나1QCT와 오픈뱅킹 시스템은 Spring boot 기반의 MVC 패턴을 이용하여 개발
- 하나증권 시스템은 Python, Flask 프레임워크과 OPEN API를 사용하여 응용 및 개발

```
사용자는 http://hana1qct.info 도메인 접속시, 하나1QCT WTS로 리다이렉트되어 서비스를 이용할 수 있습니다.
```

### 2-3. 서비스 개발

#### (1) 매매시스템 개발
![스크린샷 2024-10-11 13 29 41](https://github.com/user-attachments/assets/92442b32-660a-44c7-9eaf-a9fde334675c)
![스크린샷 2024-10-11 13 29 45](https://github.com/user-attachments/assets/0bf82dae-0204-4bcf-84e5-81ce025fbc80)

<br/>

- 실제 매매시스템 처리
- 실제 계좌 잔고 조회

#### (2) OPENBANKING API 개발
![스크린샷 2024-10-07 13 24 27](https://github.com/user-attachments/assets/fd44f2cc-efac-428b-bb3b-ead2057e13d5)

 <br/>

- 개인정보 해시화 저장
- 타 은행사 잔액 확인 및 이체

#### 그 외 활용 기술
![스크린샷 2024-10-07 13 24 23](https://github.com/user-attachments/assets/4793abc8-f804-48b4-b01f-0a97dd60d1f4)
 <br/>

# 3. 프로젝트 결과

### 3-1. 발표 ppt
[발표자료<img src="https://github.com/user-attachments/assets/425f5c3a-8b63-43fe-a80f-91c8306d0315" />
](/최종프로젝트발표자료.pdf) <br/>


### 3-2. 시연 동영상


<a href="https://youtu.be/HvK63AAM3xg"><img width="1506" alt="스크린샷 2024-10-07 13 39 59" src="https://github.com/user-attachments/assets/0c9daad2-2303-48d4-a89c-ce40767b8de4"></a><br/>


# 4. 본인 소개

| 구분       | 내용                                                                                         | 비고                                                          |
| ---------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 이름       | 오승민                                                                                       |     <img width="130px" src="https://github.com/user-attachments/assets/cdb3876b-c752-41f8-8c2a-ce084808c570">                                                          |
| 연락처     | 이메일                                                                                       | osm05230@naver.com                                            |
| Skill set  | Language                                                                                     | Java, Python, PL/SQL, Javascript, HTML, CSS, JSP, Thymeleaf   |
|            | Framework                                                                                    | Spring, SpringBoot, Flask                                     |
|            | Database                                                                                     | Oracle, MySQL                                                 |
|            | Etc                                                                                          | Git, AWS, AWS RDS, Docker, CloudFront, Maven, Gradle          |
|            | Tools                                                                                        | Eclipse, Intellij, Pycharm, Visual Studio code, SQL Developer |
| 자격증     | 정보처리기사                                                                                 | 2022.06.17                                                    |
| 전공       | 정보통신공학과                                                                               | 인천대학교 - 학점 : 3.95                                      |
| 수상       | 최우수상                                                                                     | 코리아IT아카데미(2023.09.06)                                  |
|            | 학업우수                                                                                     | 인천대학교(2022.02.21)                                        |
|            | 학업우수                                                                                     | 인천대학교(2021.08.23)                                        |
|            | 학업우수                                                                                     | 인천대학교(2019.02.18)                                        |
|            | 학업우수                                                                                     | 인천대학교(2018.08.20)                                        |
|            | 학업우수                                                                                     | 인천대학교(2018.02.19)                                        |
| 교육       | 하나금융티아이 채용연계형 교육 1200시간 (한국폴리텍대학교 광명융합기술교육원 - 데이터분석과) | 2024.03.04 ~ 2024.10.18 (1200시간)                            |
|            | 자바기반 스프링 응용SW개발자 양성과정 (코리아IT아카데미)                                     | 2023.05.30 ~ 2023.09.06 (280시간)                             |
|            | 코딩테스트 실력up패키지:문제풀이 꿀팁과 실전 모의고사(JAVA) (프로그래머스)                   | 2023.03.08 ~ 2023.04.04 (26시간)                              |
| 학내외활동 | 스마트홈 IoT 실험 및 데이터 추출, 오작동 검출 알고리즘 구현                                  | 2022.02.14 ~ 2022.11.30                                       |
|            | 자바 문제 멘토링 및 전공 튜터링                                                              | 2021.03.15 ~ 2021.11.15                                       |
