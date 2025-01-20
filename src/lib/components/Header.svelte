<script>
    function goToMain() {
        window.location.href = '/';
    }

    function goBack() {
        window.history.back();
    }
</script>

<style>
    header {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 60px;
        width: 100%;
    }
    .back-button {
        position: absolute;
        left: 0;
        background: none;
        border: none;
        cursor: pointer;
    }
    .back-button svg {
        width: 24px;
        height: 24px;
    }
    .main-button {
        background-color: #007BFF;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
</style>

<header>
    <button
        class="back-button"
        on:click={goBack}
        aria-label="goBack"
    >
        <svg viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button>
    <button class="main-button" on:click={goToMain}>Main</button>
</header>