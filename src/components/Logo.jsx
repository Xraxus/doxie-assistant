import logoImage from "../assets/doxie-tech-logo.png";

export default function Logo() {
  return (
    <div className="logo">
      <img
        src={logoImage}
        alt="A circular logo of a black tan dachshund wearing glasses with a opened book in front of it"
      />
      <h1>Doxie Assistant</h1>
    </div>
  );
}
