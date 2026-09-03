# Site Spec

Status: FROZEN_V0_2026-09-03

## Purpose
ChatGPT Sites is the public presentation layer for ProFlow and the primary ChatWeb entry for this project.

## V0 Experience
The site must explain what ProFlow is, expose major architecture/capability entry points, offer an `Ask ProFlow` chat experience, show grounded Sources and support only minimal thumbs-up/thumbs-down feedback.

## Backend Access
Browser code must not call the Dev Tunnel with a secret. Site server code reads `PROFLOW_RAG_API_KEY` from Site Secrets and calls the RAG backend over HTTPS.

## Chat UX
- Streaming is mandatory and should begin as early as practical.
- Sources appear after/alongside the completed answer and link to immutable GitHub evidence at the indexed commit and source line range.
- Anonymous usage; no login/account system in V0.
- Conversation length warnings must be visible when the context budget is approached.

## Source Ownership
Site source/configuration is versioned in this repository; ChatGPT Sites is the hosting/publishing environment, not the sole source of truth.
