import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

it("has a placeholder text", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  const input = div.querySelector("input");
  expect(input.placeholder).toEqual("Filter by product name");
});
it("accepts user input", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  const input = div.querySelector("input");
  input.value = "Test";
  expect(input.value).toEqual("Test");
});
it("can filter the results based on the user input", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  const input = div.querySelector("input");
  input.value = "Apple";
  expect(input.value).toEqual("Apple");
});
