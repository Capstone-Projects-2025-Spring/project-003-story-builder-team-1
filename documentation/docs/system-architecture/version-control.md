---
sidebar_position: 7
---

# Version Control

Version Control is handled using Git and Github.

## Branching
Branches are created from the main branch, and are created through Jira issues. These branches will have a title following the format SBTA-XX-TASK, where XX is the issue number, and TASK is the name of the issue.

## Branch Protection Rules

The following branch protection rules are in effect:
- A pull request is required before merging.
- One pull request approval is needed to merge.

## Deployment

The main branch is set up to deploy the Docusaurus documentation site using Github Actions
