# Add this before git push
- name: Pull latest changes
  run: git pull --rebase origin main

# Then your push command
- name: Push changes
  run: git push
