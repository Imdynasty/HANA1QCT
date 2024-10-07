<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!-- accounts.jsp -->
<html>
<head>
    <title>Accounts</title>
</head>
<body>
<h1>Account Information</h1>
<form action="/api/accounts" method="get">
    Resident Number: <input type="text" name="residentNumber">
    <input type="submit" value="Search">
</form>

</body>
</html>

