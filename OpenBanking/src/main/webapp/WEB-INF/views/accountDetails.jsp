<%@ page import="mydata.hanacertust.entity.MyDataAccount" %>
<%@ page import="java.util.List" %>
<%@ page import="java.text.NumberFormat" %>
<%@ page import="mydata.hanacertust.ImageHelper" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>Account Details</title>
    <!-- Bootstrap CSS 추가 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.2/dist/css/bootstrap.min.css"
          rel="stylesheet">
    <style>
      .mt-5 {
        padding: 0 !important;
      }
      
      .container {
        margin: 0;
        margin-top: 10px !important;
        width: 100%;
      }

      .card-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        border-radius: 10px;
        width: 625px;
        margin-left: 12px;
      }

      .card {
        margin-bottom: 20px;
        width: 1200px;
        border-radius: 10px;
        box-shadow: darkgrey 0 0 2px;

      }

      .card-body {
        width: 100%;
      }

      .avatar {
        width: 33px;
        height: 30px;
        border-radius: 50px;
        margin-right: 10px;
        margin-bottom: 10px;

      }

      .card-text2 {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        font-size: 20px;
      }

      .card-text {
        color: grey;
        font-size: 20px;
      }

      .card-title {
        font-size: 25px;
        font-weight: bold;
      }

      .btn {
        color: black;
        background-color: white;
        border: 1px solid green;
      }

      .btn:hover {
        color: white;
        background-color: green;
      }
    </style>
</head>
<body>
<div class="container mt-5">
    <%
        List<MyDataAccount> accounts = (List<MyDataAccount>) request.getAttribute("accounts");
        NumberFormat nf = NumberFormat.getNumberInstance();
        if (accounts != null && !accounts.isEmpty()) {
    %>
    <div class="card-container">
        <% for (MyDataAccount account : accounts) { %>
        <div class="card">
            <div class="card-body">
                <div style="display: flex; flex-direction: row; align-items: center; justify-content: flex-start">
                    <img src="<%= ImageHelper.getAvatarUrl(account.getFinancialInstitution()) %>"
                         class="avatar">

                    <h5 class="card-title"><%= account.getFinancialInstitution() %>
                    </h5>
                </div>

                <p class="card-text"><%= account.getAccountNumber() %>
                </p>
                <p class="card-text2">잔고 <%= nf.format(
                        Double.parseDouble(String.valueOf(account.getAccounts()))) %>원
                </p>
                <a href="#"
                   class="btn">알아보기</a>
            </div>
        </div>
        <% } %>
    </div>
    <% } else { %>
    <p class="text-center">No accounts found for the given resident number.</p>
    <% } %>
</div>
<!-- Bootstrap JS 추가 -->
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
