<template>
  <main class="not-found-page">
    <p class="not-found-page__eyebrow">404</p>
    <h1 class="not-found-page__title">Page not found</h1>
  </main>
</template>

<style scoped lang="scss">
.not-found-page {
  display: flex;
  min-height: 100vh;
  max-width: 64rem;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  padding: 4rem 1.5rem;
}

.not-found-page__eyebrow {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

.not-found-page__title {
  margin: 0.75rem 0 0;
  color: #020617;
  font-size: 2.25rem;
  font-weight: 600;
}
</style>
