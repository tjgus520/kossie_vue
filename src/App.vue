<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <router-link class="navbar-brand" :to="{ name: 'Home' }">Navbar Home</router-link>

    <ul class="navbar-nav me-auto">
      <li class="nav-item active">
        <!-- <router-link>Todos</router-link> -->
        <router-link class="nav-link" aria-current="page" :to="{ name: 'Todos' }">투둣스</router-link>
      </li>
    </ul>
  </nav>
  <router-view />
</template>

<script></script>

<style></style>
