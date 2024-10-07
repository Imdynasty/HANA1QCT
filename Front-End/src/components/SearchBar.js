import React, { useState } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import { SearchIcon } from "@chakra-ui/icons";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    alert(`검색: ${searchTerm}`);
    // 실제 검색 로직을 여기에 구현
  };

  return (
    <Form
      onSubmit={handleSearchSubmit}
      style={{ display: "flex", marginTop: "5px" }}>
      <FormControl
        type="text"
        placeholder="Search..."
        className="mr-sm-2"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ flex: 1 }}
      />
      <Button type="submit" variant="outline-success">
        <SearchIcon />
      </Button>
    </Form>
  );
};

export default SearchBar;
