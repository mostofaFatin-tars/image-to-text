import { useState } from "react";
import Tesseract from "tesseract.js";

const ImageTextExtractorComponent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [nameParts, setNameParts] = useState([]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setLoading(true);
    setError("");
    setFirstName("");
    setLastName("");
    setDateOfBirth("");
    setExtractedText("");
    setNameParts([]);

    try {
      const {
        data: { text },
      } = await Tesseract.recognize(file, "eng", {
        logger: (m) => console.log(m), // Log progress data
      });

      console.log(text); // Log all extracted text

      // Extract name and date of birth from the text
      const nameMatch = text.match(/Name: ([^\n]+)/);
      const dateOfBirthMatch = text.match(/Date of Birth: ([^\n]+)/);

      if (nameMatch && nameMatch[1]) {
        const nameParts = nameMatch[1].split(" ");
        const processedNameParts = processNameParts(nameParts);
        setNameParts(processedNameParts);
        arrangeNames(processedNameParts);
      }

      if (dateOfBirthMatch && dateOfBirthMatch[1]) {
        setDateOfBirth(dateOfBirthMatch[1]);
      }

      // Set the extracted text
      setExtractedText(text);
    } catch (err) {
      setError("Failed to extract text from the image.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    arrangeNames(nameParts);
  };

  const arrangeNames = (nameParts) => {
    // Shuffle the name parts randomly
    const shuffledParts = shuffleArray(nameParts.slice());
    // Combine first name and last name
    let firstName = shuffledParts[0];
    let lastName = shuffledParts.slice(1).join(" ");
    setFirstName(firstName);
    setLastName(lastName);
  };

  const processNameParts = (parts) => {
    const processedParts = [];
    parts.forEach((part) => {
      if (part.length > 8) {
        const middle = Math.floor(part.length / 2);
        processedParts.push(part.slice(0, middle));
        processedParts.push(part.slice(middle));
      } else {
        processedParts.push(part);
      }
    });
    return processedParts;
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
          <label>First Name</label>
          <input type="text" name="firstName" value={firstName} readOnly />
        </div>
        <br />
        <div>
          <label>Last Name</label>
          <input type="text" name="lastName" value={lastName} readOnly />
        </div>
        <br />
        <button onClick={handleRefresh}>Refresh</button>
        <br />
        <br />
        <div>
          <label>Date Of Birth</label>
          <input type="text" name="dob" value={dateOfBirth} readOnly />
        </div>
      </div>
    </div>
  );
};

export default ImageTextExtractorComponent;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
