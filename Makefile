.NOTPARALLEL:
infra: 
	@echo "Install node modules frontend and backend"
	cd marketplace-frontend && npm install && cd ../marketplace-backend && npm install


start: 
	@echo "Running frontend and backend"
	tmux new-session -d -s dev "cd marketplace-frontend && npm run dev"
	tmux split-window -h "cd marketplace-backend && npm run dev"
	tmux attach-session -t dev