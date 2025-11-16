import { useState } from "react";
import Api from "../api/Api";

export default function useFetch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function get(path, includeAuth = true) {
    setLoading(true);
    setError(null);
    try {
      const res = await Api.request(path, "GET", null, includeAuth);
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      return null;
    }
  }

  async function post(path, body, includeAuth = true) {
    setLoading(true);
    setError(null);
    try {
      const res = await Api.request(path, "POST", body, includeAuth);
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      return null;
    }
  }

  return {
    loading,
    error,
    get,
    post,
  };
}
