<script>
	let name = "Yoshi";
	let beltColor = "Black";
	const handleClick = () => {
		beltColor = "Yellow";
	};

	const handleInputChange = (e) => {
		beltColor = e.target.value;
	};


	let firstName = "Chandler";
	let lastName = "Bing";

	// Reactive values
	$:fullName = `${firstName} ${lastName}`;

	// Reactive statements
	// $: console.log(beltColor);

	$: {
		console.log(beltColor)
		console.log(fullName);
	};

	export let friends;

	const deleteHandle = (id) => {
		console.log("id", id)

		friends = friends.filter((friend) => friend.id !== id);
	};

	let num = 25;

</script>

<main>
	<!-- <h1>Hello {name}!</h1>
	<p style="color: {beltColor}">{beltColor} belt</p>
	<button on:click={handleClick}>Update beltColor</button> -->

	<!-- 1 way binding -->
	<!-- <input type="text" value={beltColor} on:input={handleInputChange}/> -->
	
	<!-- 2 way data binding -->
	<!-- <input type="text" bind:value={beltColor}>  -->

	<!-- <p>{firstName} {lastName} : {beltColor} belt</p> -->
	<p>{fullName} : {beltColor} belt</p>
	<input type="text" bind:value={firstName}>
	<input type="text" bind:value={lastName}>
	<input type="text" bind:value={beltColor}>
	
	<!-- <div style="color:{beltColor}">
		<h4>{friends[0].name}</h4>
		<p>{friends[0].beltColor}</p>
	</div> -->

	{#each friends as friend (friend.id)}
		<div style="color:{friend.beltColor}; border: 1px solid black; margin:1rem 0rem;">
			<h4>{friend.name}</h4>
			{#if friend.beltColor === "black"}
				<strong>MASTER</strong>
			{/if}
			<p>{friend.age} years old, {friend.beltColor} belt.</p>
			<button on:click={() => deleteHandle(friend.id)}>Delete</button>
		</div>
		{:else}
		<div>There are no friends....</div>
	{/each}

	{#if num > 20}
		<h1>{num} greater than 20</h1>	
	{:else}
		<h1>{num}</h1>
	{/if}
	

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