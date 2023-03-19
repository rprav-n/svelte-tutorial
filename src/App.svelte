<script>
 	import AddPersonForm from "./AddPersonForm.svelte";
  	import Modal from "./Modal.svelte";
	import Tutorial from "./Tutorial.svelte";

		// Loops
	let friends = [
		{name:"Joey", beltColor:"red", age: 25, id:1},
		{name:"Ross", beltColor:"blue", age: 24, id:2},
		{name:"Chandler", beltColor:"black", age: 24, id:3},
	];
	let showModal = false;

	const handleToggleModal = () => {
		showModal = !showModal;
	};

	/* const handleSubmitForm = (event) => {
		const formData = new FormData(event.target); // Create a new FormData object from the form
		console.log("formData", formData)
		const data = Object.fromEntries(formData.entries()); // Convert the FormData object to a plain JavaScript object
		console.log(data); // Log the form data to the console
	}; */

	const handleAddFriend = (event) => {
		console.log("event", event.detail)
		const friend = event.detail
		
		// friends.push(friend) // This does not UPDATE the UI

		friends = [friend, ...friends]
		showModal = false;
		
	};



</script>

<main>

	<button on:click={handleToggleModal}>Open Modal</button>
	
	<Tutorial {friends} />
	
	<!-- If prop name and variable name is same, we can do a shorthand -->
	<Modal message="Sign Up Offers" {showModal} on:click={handleToggleModal}>
		
		<!-- Slots -->
		<!-- <form>
			<input type="text" placeholder="name">
			<input type="text" placeholder="belt color">
			<button>Add person</button>
		</form>
		<div slot="title">
			<h3>Add a new person</h3>
		</div> -->
		<AddPersonForm on:addFriend={handleAddFriend} />
	</Modal>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>