// client/src/components/SearchForm.js

// 1. Import the `useState` Hook. We need it to manage the input field's value.
import { useState } from 'react';

// 2. The component now accepts props. We use destructuring to get `onSearch` directly.
function SearchForm({ onSearch }) {
  // 3. Create a state variable to hold the value of the city input field.
  // We initialize it as an empty string.
  const [city, setCity] = useState('');

  // 4. Define the function that will be called when the form is submitted.
  const handleSubmit = (event) => {
    // a. Prevent the default form submission behavior, which is to reload the page.
    event.preventDefault();

    // b. Perform a simple validation: if the city input is empty, do nothing.
    if (!city.trim()) return;

    // c. Call the `onSearch` function that was passed down from the App component,
    // passing the current value of our 'city' state as the argument.
    onSearch(city);

    // d. Optional: Clear the input field after a successful search.
    setCity('');
  };

  return (
    // 5. Hook up our handleSubmit function to the form's `onSubmit` event.
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter city name..."
        className="search-input"
        // 6. The input's `value` is now tied directly to our `city` state.
        value={city}
        // 7. The `onChange` event is fired every time the user types.
        // We update our `city` state with the input's current value.
        onChange={(e) => setCity(e.target.value)}
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
}

export default SearchForm;