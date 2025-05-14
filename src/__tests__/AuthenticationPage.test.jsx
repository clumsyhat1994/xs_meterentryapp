import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthenticationPage from "../AuthenticationPage";
import axios from "axios";

jest.mock("axios");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: { from: "/protected" } }),
}));
