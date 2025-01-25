<script lang="ts">
    import img from '$lib/images/itmo-cs-logo.png';

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
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        background-color: #101f27;
        padding: 16px 0;
    }
    .buttons {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        position: relative;
    }
    .back-button {
        background: none;
        border: none;
        cursor: pointer;
        margin-right: 8px;
    }
    .back-button svg {
        width: 24px;
        height: 24px;
    }
    .main-button {
        padding: 8px 16px;
        background: none;
        border: none;
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
    img {
        width: 90%;
    }
</style>

<header>
    <div class="buttons">
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
    </div>
    
    <img src={img} alt="Logo" />
</header>
