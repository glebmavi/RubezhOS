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
        background-color: white;
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: large;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .main-button svg {
        width: 36px;
        height: 36px;
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
    <button class="main-button" on:click={goToMain} aria-label="goToMain">
        <svg viewBox="0 0 24 24">
            <path d="M9 20H7c-1.1 0-2-.9-2-2V10.9c0-.6.3-1.1.7-1.5l5-4.3c.7-.6 1.9-.6 2.6 0l5 4.3c.4.4.7.9.7 1.5V18c0 1.1-.9 2-2 2H15M9 20V14c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v6M9 20h6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button>
</header>
