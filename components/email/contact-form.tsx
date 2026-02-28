export default function ContactForm({ name, email, message }: { name: string; email: string; message: string }) {
  return (
    <div>
      <h1>Contact Form</h1>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
      <p>Message: {message}</p>
    </div>
  );
}
