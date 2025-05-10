import React from 'react';

export default function Admin() {
  const [Email, setEmail] = useState();
  return (
    <div>
      <h1>Admin</h1>
      <input type="email" name="email" />
    </div>
  );
}
