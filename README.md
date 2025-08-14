## Getting Start

-> This project uses tailwind.css

To get start just run `npm run dev` in root after install all dependencies. 


## Workspaces

To change between 2 themes ( workspaces ), just change de config.yml with the credentials


find . -type f -name "*.svg" | while read -r file; do     mv "$file" "${file%.svg}.liquid"; done