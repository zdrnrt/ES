import { defineConfig } from 'vite';
import { resolve } from "path";

export default defineConfig({
	base: '/ES/',
	build: {
		outDir: 'dist',
		rollupOptions: {
			input: {
				index: resolve(__dirname, "index.html"),
				data: resolve(__dirname, 'src/html/data.html'),
				driver: resolve(__dirname, 'src/html/driver.html'),
				clustering: resolve(__dirname, 'src/html/clustering.html'),
				norming: resolve(__dirname, 'src/html/norming.html'),
				report: resolve(__dirname, 'src/html/report.html'),
				control: resolve(__dirname, 'src/html/control.html'),
				priority: resolve(__dirname, 'src/html/priority.html'),
				forecast: resolve(__dirname, 'src/html/forecast.html'),
				parameters: resolve(__dirname, 'src/html/forecastParameters.html'),
				modelingResult: resolve(__dirname, 'src/html/modelingResult.html'),
				mapSetting: resolve(__dirname, 'src/html/mapSetting.html'),
			}
		}
	}
});