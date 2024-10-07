import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import axios from "axios"; // Axios import
import CircularProgress from "@mui/material/CircularProgress";
import MydataCard from "./AccountsCard";
import { background } from "@chakra-ui/react";
import { maxHeight } from "@mui/system";
import AnimatedNumber from "../AnimatedNumber";

export default function BasicCard({ accountId }) {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false); // 상태 추가
  const handleExchange = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setReload(!reload); //
  };

  const [account, setAccount] = React.useState({
    accountId: "",
    title: "Loading...",
    subTitle: "Loading...",
    description: "Loading...",
    actionText: "Loading...",
  });
  const modalStyle = {
    maxHeight: "600px",
    overflowX: "hidden",
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      async function fetchData() {
        try {
          const response = await axios.get(
            `http://13.125.78.241:8081/accounts/${accountId}`
          );
          const data = response.data;
          setAccount({
            title: data.accountId,
            subTitle: data.accountNumber,
            // description: `${parseInt(data.cash).toLocaleString()}원`,
            description: data.cash,
            actionText: "충전하기",
          });
        } catch (error) {
          console.error("Error fetching data:", error);
          setAccount({
            title: "Error Loading",
            subTitle: "N/A",
            description: "N/A",
            actionText: "Retry",
          });
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, 1000);
  }, [accountId, reload]);

  if (loading) {
    return (
      <Card
        sx={{
          minWidth: 275,
          marginTop: 5.5,
          border: "1px solid #e0e0e0",
          borderRadius: "15px",
        }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 140,
            }}>
            <CircularProgress
              disableShrink
              size={50}
              color="success"
              thickness={2}
            />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        minWidth: 275,
        marginTop: 6,
        border: "1px solid #e0e0e0",
        borderRadius: "15px",
      }}>
      <CardContent>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex" }}>
            <Avatar
              src={`${process.env.PUBLIC_URL}/img/logo.png`}
              style={{ marginRight: "20px" }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}>
              <Typography variant="h5" component="div">
                {account.title}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {account.subTitle}
              </Typography>
            </div>
          </div>
          <Typography
            variant="body2"
            sx={{
              fontSize: 30,
              fontFamily: "Noto Sans KR",
              fontWeight: "600",
            }}>
            <AnimatedNumber value={parseFloat(account.description)} />
          </Typography>
        </div>
      </CardContent>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <CardActions>
          <Button
            onClick={handleExchange}
            size="medium"
            style={{ fontSize: "25px", color: "green" }}>
            {account.actionText}
          </Button>
          {showModal && (
            <div className="backdrop">
              <div
                className="modal"
                style={{
                  width: "1050px",
                  height: "700px",
                  borderBottom: "10px solid #e0e0e0",
                  overflowY: "hidden",
                }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignContent: "center",
                    borderBottom: "1px solid #e5e5e5",
                  }}>
                  <h2 style={{ paddingLeft: "10px", paddingTop: "10px" }}>
                    나의 자산
                  </h2>
                  <Button onClick={closeModal}>
                    <span style={{ fontSize: "24px" }} className="close">
                      &times;
                    </span>
                  </Button>
                </div>
                <MydataCard modalStyle={modalStyle} accountId={accountId} />
              </div>
            </div>
          )}
        </CardActions>
      </div>
    </Card>
  );
}
