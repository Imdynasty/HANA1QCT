import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";

export default function MultiActionAreaCard() {
  const videoSource = `${process.env.PUBLIC_URL}/img/mydatavideo.mp4`;

  return (
    <Card
      sx={{
        width: 500, // 카드의 전체 너비
        height: 450, // 카드의 전체 높이
        display: "flex",
        flexDirection: "column",
        background: "rgb(253 253 255)",
        justifyContent: "space-between",
        borderRadius: "20px",
        marginTop: "20px",
      }}>
      <CardActionArea>
        <video
          style={{ maxWidth: "100%", height: "auto", top: "240px" }} // 비디오가 카드 너비에 맞게 조정됩니다.
          autoPlay
          muted
          loop>
          <source src={videoSource} type="video/mp4" />
        </video>
      </CardActionArea>
    </Card>
  );
}
