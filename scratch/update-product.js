async function update() {
  try {
    const res = await fetch('http://localhost:3001/api/products/graded-makhana', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer odisha_admin_2024'
      },
      body: JSON.stringify({
        images: [
          "/images/makhana_bowl.png",
          "/images/makhana_packaging.png",
          "/images/makhana_traditional.png"
        ]
      })
    });
    const data = await res.json();
    console.log('Update Success:', data.success);
  } catch (err) {
    console.error('Update Failed:', err);
  }
}

update();
