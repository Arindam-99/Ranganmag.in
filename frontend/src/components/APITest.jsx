import React, { useState, useEffect } from "react";
import axios from "axios";

const APITest = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawResponse, setRawResponse] = useState(null);

  useEffect(() => {
    testAPI();
  }, []);

  const testAPI = async () => {
    try {
      console.log("APITest: Starting API call...");
      setLoading(true);
      setError(null);

      // Try with fetch first
      console.log("APITest: Trying with fetch...");
      const fetchResponse = await fetch(
        "http://localhost:5000/api/articles?status=published"
      );
      console.log("APITest: Fetch response status:", fetchResponse.status);
      const fetchData = await fetchResponse.json();
      console.log("APITest: Fetch data:", fetchData);

      // Then try with axios
      console.log("APITest: Trying with axios...");
      const response = await axios.get(
        "http://localhost:5000/api/articles?status=published"
      );
      console.log("APITest: Axios response:", response);
      console.log("APITest: Axios response data:", response.data);

      setRawResponse(response.data);

      if (response.data.success) {
        setArticles(response.data.data);
        setError(null);
      } else {
        setError("API returned success: false");
      }
    } catch (err) {
      console.error("APITest: Error:", err);
      setError(`${err.name}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="api-test p-4 border rounded">
      <h4>API Test Component</h4>

      <div className="mb-3">
        <strong>Status:</strong> {loading ? "Loading..." : "Complete"}
      </div>

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="mb-3">
        <strong>Raw Response:</strong>
        <pre className="bg-light p-2 small">
          {JSON.stringify(rawResponse, null, 2)}
        </pre>
      </div>

      <div className="mb-3">
        <strong>Articles Count:</strong> {articles.length}
      </div>

      {articles.length > 0 && (
        <div>
          <strong>First Article:</strong>
          <pre className="bg-light p-2 small">
            {JSON.stringify(articles[0], null, 2)}
          </pre>
        </div>
      )}

      <button onClick={testAPI} className="btn btn-primary btn-sm">
        Retry API Call
      </button>
    </div>
  );
};

export default APITest;
