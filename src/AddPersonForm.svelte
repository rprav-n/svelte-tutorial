<script>
    import { createEventDispatcher } from "svelte";

    let name;
    let beltColor;
    let age;

    // let fighting = false;
    // let sneaking = false;
    // let running = false;

    let skills = [];

    const handleSubmit = () => {
        // console.log(name, beltColor, age, fighting, sneaking, running);
        console.log(name, beltColor, age, skills, beltColor);

        const friend = {
            name,
            beltColor,
            age,
            id: Math.random(),
        }

        dispatch('addFriend', friend);
    };

    let dispatch = createEventDispatcher();

</script>

<div>
    <h3>Add a new person</h3>
    <form on:submit|preventDefault={handleSubmit}>
        <input type="text" placeholder="name" name="name" bind:value={name}>
        <input type="number"  placeholder="age" name="age" bind:value={age}>

        <label>Skills:</label>
        <!-- <input type="checkbox" bind:checked={fighting}> fighting <br>
        <input type="checkbox" bind:checked={sneaking}> sneaking <br>
        <input type="checkbox" bind:checked={running}> running <br> -->

        <input type="checkbox" bind:group={skills} value="fighting"> fighting <br>
        <input type="checkbox" bind:group={skills} value="sneaking"> sneaking <br>
        <input type="checkbox" bind:group={skills} value="running"> running <br>

        <label>Belt Color</label>
        <select bind:value={beltColor}>
            <option value="black">black</option>
            <option value="red">red</option>
            <option value="yellow">yellow</option>
            <option value="brown">brown</option>
        </select>

        <button>Add person</button>
    </form>
</div>

<style>
    
</style>