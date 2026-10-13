# Evidence Assets — What to Add

This folder is for **real screenshots, plots, and images** from your actual work.
Replace the evidence placeholders in the presentation with these files.

## Required Evidence Files

### High Priority (strongly recommended for credibility)

| Filename | Description | Where Used |
|---|---|---|
| `ecg_rpeak_plot.png` | ECG waveform with detected R-peaks highlighted | Slides 4, 5 |
| `mitbih_results.png` | Screenshot of MIT-BIH evaluation output (Se, +P, confusion matrix) | Slide 5 |
| `kicad_schematic.png` | KiCad schematic screenshot of BLE wearable PCB | Slide 8 |
| `kicad_pcb_layout.png` | KiCad PCB layout view | Slide 8 |
| `kicad_3d_view.png` | KiCad 3D render of the PCB | Slide 8 |
| `dashboard_screenshot.png` | Screenshot of live analytics dashboard | Slide 9 |

### Medium Priority (good to have)

| Filename | Description | Where Used |
|---|---|---|
| `fabricated_pcb.jpg` | Photo of physical fabricated PCB (if available) | Slide 8 |
| `novara_prototype.jpg` | Photo of Novara hardware prototype | Slide 3 |
| `hrv_features_output.png` | HRV feature extraction output/plot | Slide 4, Backup B1 |
| `ml_training_curves.png` | ML model training/validation curves | Slide 6, Backup B3 |
| `classification_output.png` | Physiological state classifier output | Slide 9 |
| `code_screenshot.png` | Key code section screenshot | Backup B6 |

### Optional (for backup slides)

| Filename | Description | Where Used |
|---|---|---|
| `power_tree_diagram.png` | PCB power architecture diagram | Backup B5 |
| `confusion_matrix.png` | Detailed confusion matrix visualization | Backup B3 |
| `dataset_records.png` | MIT-BIH record list/details | Backup B4 |

## How to Replace Placeholders

1. Save your image files in this `assets/` folder
2. Open `index.html`
3. Search for `evidence-placeholder` divs
4. Replace with `<img src="assets/YOUR_FILE.png" alt="description" style="max-width:100%; border-radius:8px;">`

## Image Guidelines

- **Format**: PNG for screenshots/plots, JPG for photos
- **Resolution**: At least 1200px wide for clarity on large screens
- **Aspect ratio**: 16:9 or 4:3 works best
- **Dark backgrounds**: If possible, use dark-themed plots to match the presentation
- **No sensitive data**: Remove any personal data, file paths, etc. from screenshots
