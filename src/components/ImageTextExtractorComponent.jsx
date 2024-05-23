import { useState } from "react";
import Tesseract from "tesseract.js";

const ImageTextExtractorComponent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setLoading(true);
    setError("");
    setName("");
    setDateOfBirth("");

    try {
      const {
        data: { text },
      } = await Tesseract.recognize(file, "eng", {
        logger: (m) => console.log(m), // Log progress data
      });

      // Extract name and date of birth from the text
      const nameMatch = text.match(/Name: ([^\n]+)/);
      const dateOfBirthMatch = text.match(/Date of Birth: ([^\n]+)/);

      if (nameMatch && nameMatch[1]) {
        setName(nameMatch[1]);
      }

      if (dateOfBirthMatch && dateOfBirthMatch[1]) {
        setDateOfBirth(dateOfBirthMatch[1]);
      }
    } catch (err) {
      setError("Failed to extract text from the image.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <br />
      <br />
      <div>
        <div>
          <label>Name</label>
          <input type="text" name="name" value={name} />
        </div>
        <br />
        <div>
          <label>Date Of Birth</label>
          <input type="dob" name="dob" value={dateOfBirth} />
        </div>
      </div>
    </div>
  );
};

export default ImageTextExtractorComponent;
