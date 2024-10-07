import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Box,
  Heading,
  Text,
  Image,
  SimpleGrid,
  Button,
  Link,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Badge from "react-bootstrap/Badge";

const New1 = `${process.env.PUBLIC_URL}/img/news01.png`;
const New2 = `${process.env.PUBLIC_URL}/img/news02.png`;
const New3 = `${process.env.PUBLIC_URL}/img/news3.png`;

const Newscard = () => {
  return (
    <div style={{ width: "100%" }}>
      <SimpleGrid
        spacing="24px"
        templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
        padding="20px"
        cursor={"pointer"}>
        {[
          {
            img: New1,
            headline: "하나증권, LSEG런던증권거래소 그룹 업무협약 체결",
            detail:
              "글로벌 금융 데이터 시장정보 제공 강화 업무협업 통해 국내 최초 ‘AI 내부자 시그널’ 신규 서비스 선보여",
            date: "2024.10.02",
            link: "https://www.hanafn.com:8002/mediaRoom/hanaNews/newsList.do",
          },
          {
            img: New2,
            headline: "하나은행, 인도네시아 루피아 현지 통화 직거래 시행!",
            detail:
              "수출입 기업, 인도네시아 루피아(IDR)로 무역대금 결제 가능, 거래 비용 절감 효과",
            date: "2024.09.30",
            link: "https://www.hanafn.com:8002/mediaRoom/hanaNews/newsList.do",
          },
          {
            img: New3,
            headline: "중소기업 근로자의 안정적 자산 형성 지원 나선다!",
            detail:
              "중소기업 근로자 복지증진 및 장기재직 지원 통해 중소기업 인력난 해소에 기여",
            date: "2024.09.19",
            link: "https://www.hanafn.com:8002/mediaRoom/hanaNews/newsList.do",
          },
        ].map((news, index) => (
          <Card key={index} boxShadow="xl" p="6" rounded="md" bg="white">
            <CardHeader>
              <Link href={news.link} isExternal>
                <Image
                  style={{
                    width: "100%",
                    height: "200px",
                    borderRadius: "15px",
                    marginBottom: "10px",
                    transition: "transform 0.3s ease-in-out",
                  }}
                  src={news.img}
                  alt="News Image"
                  _hover={{ transform: "scale(1.05)" }}
                />
              </Link>
            </CardHeader>
            <CardBody style={{ minHeight: "150px" }}>
              <Text style={{ textAlign: "left", fontWeight: "bolder" }}>
                {news.headline}
              </Text>
              <Box borderBottom="0.2px solid lightgray" mb="10px" />
              <Text fontSize="sm" style={{ color: "gray", textAlign: "left" }}>
                {news.detail}
              </Text>
            </CardBody>
            <CardFooter>
              <Badge bg="light" style={{ fontSize: "15px", color: "black" }}>
                {news.date}
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
    </div>
  );
};

export default Newscard;
