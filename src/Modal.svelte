<script>
    export let message = "Default value";
    export let showModal = false;
    export let isPromo = false;

    // Event Modifiers
    // once - makes sure the event can only fire once (removes handler)
    // preventDefault - prevent the default action (run e.preventDefault)
    // self - only fires the event if the clicked element is the target

</script>

{#if showModal}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="backdrop" class:promo={isPromo} on:click|self>
        <div class="modal">
            {message}

            <slot name="title"></slot>
            <slot></slot>
        </div>
    </div>
{/if}

<style>
    .backdrop {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        position: fixed;
        background: rgba(0, 0, 0, 0.6);
    }
    .modal {
        padding: 10px;
        border-radius: 10px;
        max-width: 400px;
        margin: 10% auto;
        text-align: center;
        background-color: white;
    }
    .promo .modal {
        background-color: crimson;
        color: white;
    }
</style>