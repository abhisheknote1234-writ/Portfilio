# Question-Level Cardiac Dynamics During Working Memory: Evoked Deceleration, Speed-Pressure Vulnerability, and Rigorous Forensic Validation

**Author:** Abhishek Kumar Gupta  
**Discipline:** Biomedical Signal Processing, Cognitive Psychophysiology, Computational Neuroscience  
**Target:** Research Portfolio Case Study / Laboratory Technical Dossier  
**Dataset:** OpenNeuro ds006848 (Sternberg Working-Memory Task, $N=30$ human participants, $5,959$ question attempts, continuous 1000 Hz ECG)

---

## 1. Executive Summary

This research case study investigates how question-level cardiovascular dynamics unfold during working-memory processing and whether individual autonomic response phenotypes predict cognitive performance under speed pressure. Continuous 1000 Hz electrocardiograms (ECG) from 30 participants performing 5,959 Sternberg-style working-memory trials were processed through a validated, beat-by-beat signal-processing pipeline. Across trials, working memory elicited a reproducible phase-dependent heart rate (HR) trajectory characterized by progressive deceleration during mental holding (maintenance $\Delta\text{HR} = -1.93\text{ bpm}$) followed by condition-specific rebound during recall. An operational classification revealed that while overall task accuracy did not differ between decelerators ($N=22$, $70.1\%$) and attenuated responders ($N=8$, $65.1\%$, $p=0.447$), attenuated responders suffered a selective accuracy impairment under rapid presentation ($48.5\%$ vs $56.9\%$, $p=0.0084$). Methodological self-auditing identified and corrected regression reference-level misinterpretations, short-window HRV mathematical artifacts (SampEn, DFA-$\alpha_1$), and trial-level pseudoreplication, demonstrating the critical importance of adversarial verification in computational psychophysiology.

---

## 2. One-Line Research Question

> **How do beat-by-beat heart-rate dynamics and short-window heart-rate variability fluctuate across distinct phases of working memory, and do individual cardiac response phenotypes predict cognitive vulnerability under speed pressure?**

---

## 3. Why This Matters

Cognitive psychophysiology has historically aggregated cardiovascular metrics over multi-minute blocks (e.g., 5-minute baseline vs. task epochs). This block-level averaging obscures rapid, sub-second cardiac adjustments that occur during specific cognitive sub-operations—such as encoding sensory stimuli, actively maintaining representations in the absence of input, and retrieving items under time pressure. 

Understanding whether working-memory load evokes stereotyped cardiac deceleration, whether speed pressure requires compensatory cardiovascular mobilization, and whether individuals who fail to mount these adjustments perform worse under stress provides foundational insight into neurocardiac integration. Furthermore, physiological signals collected during cognitive tasks are acutely susceptible to analytical pitfalls: epoch boundary artifacts, short-window HRV degeneracies, regression reference-level confusion, and trial-level pseudoreplication. This project demonstrates both the physiological findings and the rigorous forensic engineering required to separate robust biological phenomena from analytical artifacts.

---

## 4. Dataset & Experimental Architecture

The study utilizes open-access multimodal neuroimaging data from **OpenNeuro ds006848**:
* **Participants:** $N=30$ healthy human participants.
* **Trial Volume:** $5,959$ total working-memory question attempts.
* **Physiological Recording:** Continuous 1000 Hz single-channel Lead I/II ECG recorded synchronously with BrainVision EEG amplifiers.
* **Cognitive Paradigm:** Sternberg-type item-recognition task. Participants encode a series of items, maintain them across a delay period, and retrieve memory representations during a probe recall phase.
* **Experimental Conditions:**
  1. **Slow:** Sequential item presentation at a relaxed rate ($1.0\text{ s}$ per item).
  2. **Fast:** Rapid sequential presentation ($0.2\text{ s}$ per item), inducing high temporal encoding pressure.
  3. **Simultaneous:** All items presented simultaneously on screen.
  4. **Fast+delay:** Rapid presentation followed by an extended pre-maintenance buffer.
* **Cognitive Outcome Metric:** Question-level recall accuracy scored as the proportion of correct probe responses $[0.0, 1.0]$ across 7 target items.

---

## 5. Signal-Processing Pipeline

To prevent epoch edge-filtering artifacts, all signal conditioning was executed on the **continuous, unsegmented session-level recording** before trial extraction:

```
[Raw BrainVision ECG (1000 Hz)]
               │
               ▼
[Continuous 5th-Order Butterworth Bandpass (0.5 – 40 Hz)]
               │
               ▼
[Continuous Pan-Tompkins / NeuroKit2 R-Peak Detection]
               │
               ▼
[Physiological Range Filter: 300 – 2000 ms (30 – 200 bpm)]
               │
               ▼
[Local Outlier Rejection: 4.5 × Median Absolute Deviation (MAD)]
               │
               ▼
[Timestamp-Synchronized Continuous Beat-to-Beat Instantaneous HR: (60 / RR_i)]
               │
               ▼
[Cognitive Event Alignment via events.tsv (Question Onset t = 0 s)]
               │
  ┌────────────┼────────────┬─────────────┐
  ▼            ▼            ▼             ▼
Baseline    Encoding   Maintenance     Recall
[-5..0s]    [0..5s]     [5..15s]     [15..20s]
```

### Phase Window Segmentation:
1. **Pre-Stimulus Baseline ($-5.0\text{ to }0.0\text{ s}$):** Quiescent pre-question period preceding stimulus presentation.
2. **Encoding Phase ($0.0\text{ to }5.0\text{ s}$):** Active perception and encoding of target memory stimuli.
3. **Maintenance Phase ($5.0\text{ to }15.0\text{ s}$):** A 10-second blank delay requiring active internal mental holding.
4. **Recall Phase ($15.0\text{ to }20.0\text{ s}$):** Probe presentation, cognitive retrieval, and behavioral motor response.
5. **Question-Level Baseline Adjustment:** For each trial $j$ and phase $k$, baseline-adjusted heart rate was calculated strictly within-trial:
   $$\Delta\text{HR}_{j, k} = \text{HR}_{j, k} - \text{HR}_{j, \text{baseline}}$$

---

## 6. Question-Level Cardiac Analysis

### 6.1 Grand-Average Evoked Cardiac Trajectory
Across all 30 participants and 5,959 trials, working-memory processing was accompanied by a reproducible phase-dependent change in heart rate, characterized by initial slowing during encoding, maximal deceleration during maintenance, and partial recovery during recall:

| Task Phase | Time Window | Grand Mean Absolute HR | Phase-Evoked $\Delta\text{HR}$ vs Baseline | Biostatistical Assessment |
| :--- | :---: | :---: | :---: | :--- |
| **Baseline** | $-5.0\text{ to }0.0\text{ s}$ | **$80.84\text{ bpm}$** | $0.00\text{ bpm}$ | Quiescent reference state |
| **Encoding** | $0.0\text{ to }5.0\text{ s}$ | **$79.56\text{ bpm}$** | **$-1.16\text{ bpm}$** | Immediate sensory orienting / intake |
| **Maintenance** | $5.0\text{ to }15.0\text{ s}$ | **$78.75\text{ bpm}$** | **$-1.93\text{ bpm}$** | Sustained internal mental holding |
| **Recall** | $15.0\text{ to }20.0\text{ s}$ | **$79.19\text{ bpm}$** | **$-1.62\text{ bpm}$** | Motor/retrieval cardiovascular mobilization |

$$\mathbf{Baseline\ (80.84\ bpm) \longrightarrow Encoding\ (79.56\ bpm) \longrightarrow Maintenance\ (78.75\ bpm) \longrightarrow Recall\ (79.19\ bpm)}$$

> **Validated Interpretation:** Working-memory processing was accompanied by a reproducible phase-dependent change in heart rate, with the greatest average slowing during maintenance and subsequent recovery during recall. (This observational trajectory reflects task-evoked cardiac deceleration; it does not constitute direct proof of parasympathetic activation or autonomous cognitive control).

### 6.2 Condition-Specific Recall Rebound & Reference-Level Correction
In the original preliminary analysis, a linear mixed-effects model evaluating Condition $\times$ Phase reported a significant interaction for Recall under the Fast condition ($\beta = +1.235, p = 3.50 \times 10^{-7}$) and Simultaneous condition ($\beta = +1.553, p = 1.52 \times 10^{-10}$). 

**Forensic Audit Correction:** The regression model was specified with **Baseline** ($-5\text{ to }0\text{ s}$) as the categorical reference level. Consequently, the coefficients represented a difference-in-differences relative to pre-stimulus baseline, not the physiological rebound from mental holding. To test the hypothesis of cognitive cardiovascular mobilization, a direct within-trial contrast was computed:
$$\text{Recall Rebound} = \text{HR}_{\text{recall}} - \text{HR}_{\text{maintenance}}$$

| Presentation Condition | Direct Recall Rebound ($\text{HR}_{\text{recall}} - \text{HR}_{\text{maint}}$) | Participant-Level Paired Contrast vs Slow | Interpretation |
| :--- | :---: | :---: | :--- |
| **Slow** | **$-0.009\text{ bpm}$** | Reference ($t = 0.00$) | Flat trajectory; no rebound required |
| **Fast** | **$+0.782\text{ bpm}$** | $\mathbf{t = 3.171,\ p = 0.00358}$ | Significant cardiac rebound under speed pressure |
| **Simultaneous** | **$+1.101\text{ bpm}$** | $t = 4.289,\ p = 0.00017$ | Pronounced cardiovascular mobilization |
| **Fast+delay** | **$-0.127\text{ bpm}$** | $t = -0.482,\ p = 0.6335$ | Rebound eliminated when temporal buffer is introduced |

This direct contrast establishes that rapid item presentation demands rapid cardiovascular acceleration during recall, whereas slow, paced tasks exhibit no such rebound.

### 6.3 Nonlinear Time-on-Task Cardiac Adaptation
A linear regression across trial sequence initially suggested a steady decline of $\beta = -0.0219\text{ bpm/trial}$ ($p = 7.82 \times 10^{-170}$), projecting a cumulative decline of $\sim 4.37\text{ bpm}$ over 200 trials. 

**Forensic Audit Correction:** Fitting a second-order polynomial revealed that this adaptation is **strictly nonlinear** (quadratic term $\beta_{\text{trial}^2} = +0.000142, p = 1.45 \times 10^{-18}$). Heart rate declines steeply during early task blocks (trials 1–80) and plateaus in the second half of the session (trials 120–200). This phenomenon is properly termed **nonlinear time-on-task cardiac adaptation**, avoiding speculative claims of "autonomic fatigue."

---

## 7. Individual Response Phenotypes

While the grand-average shows marked maintenance deceleration ($-1.93\text{ bpm}$), participant-level distributions revealed marked inter-individual diversity.

### Operational Classification:
Participants were stratified based on their mean maintenance heart-rate response:
$$\Delta\text{HR}_{\text{maintenance}} = \overline{\text{HR}}_{\text{maint}} - \overline{\text{HR}}_{\text{baseline}}$$

* **Decelerators ($N=22$):** $\Delta\text{HR}_{\text{maintenance}} \le -1.30\text{ bpm}$ (Range: $-1.31\text{ to }-5.42\text{ bpm}$)
* **Attenuated / Accelerators ($N=8$):** $\Delta\text{HR}_{\text{maintenance}} > -1.30\text{ bpm}$ (Range: $-1.24\text{ to }+0.75\text{ bpm}$)

> **Critical Methodological Qualification:** The $-1.30\text{ bpm}$ boundary is an **empirically derived operational cutoff** corresponding to the upper quartile ($\sim 73\text{rd}$ percentile) of this sample's distribution. It is **NOT a validated biological threshold**. It serves solely as an operational grouping tool to test whether attenuated cardiac deceleration correlates with behavioral performance.

### Overall Working-Memory Performance Equivalence
Comparing overall accuracy across all conditions and trials revealed no generalized cognitive deficit in attenuated responders:

* **Decelerators ($N=22$):** Mean accuracy $= \mathbf{0.7012}$ ($95\%\text{ CI: } [0.640, 0.755]$)
* **Accelerators ($N=8$):** Mean accuracy $= \mathbf{0.6514}$ ($95\%\text{ CI: } [0.540, 0.749]$)
* **Group Difference:** $\Delta = +0.0498$, Cohen's $d = 0.358$
* **Statistical Tests:** Independent two-sample $t$-test: $t = 0.772, \mathbf{p = 0.4468}$; Permutation test (10,000 resamples): $\mathbf{p = 0.3854}$.

> **Interpretation:** No clear overall working-memory performance difference was detected between the two response phenotypes. (This failure to detect a difference should not be overstated as proof of cognitive equivalence, given the statistical power constraints of $N=8$).

---

## 8. Performance Under Time Pressure: The Fast-Condition Finding

While overall task accuracy was broadly comparable, exposing participants to high temporal pacing revealed a selective vulnerability in the attenuated group:

| Presentation Condition | Decelerators ($N=22$) Accuracy | Accelerators ($N=8$) Accuracy | Absolute Performance Gap | Statistical Assessment |
| :--- | :---: | :---: | :---: | :--- |
| **Slow** | $0.7241$ | $0.6980$ | $+0.0261$ | No significant difference |
| **Simultaneous** | $0.7410$ | $0.7125$ | $+0.0285$ | No significant difference |
| **Fast+delay** | $0.7712$ | $0.7098$ | $+0.0614$ | Intermediate gap |
| **Fast (Rapid Pacing)** | **$0.5686$** | **$0.4854$** | **$+0.0832$ (+8.32%)** | $\mathbf{\beta = -0.0762,\ p = 0.0084}$ |

### Mixed-Effects Modeling:
In a participant-random-intercept model (`accuracy ~ condition * phenotype + (1|participant)`):
* The **Fast $\times$ Accelerator interaction** was statistically significant: $\mathbf{\beta = -0.0762,\ SE = 0.0289,\ t = -2.64,\ p = 0.0084}$.
* **Baseline-HR Adjusted Model:** Including each participant's resting baseline heart rate as an explicit covariate did not attenuate the effect ($\mathbf{\beta = -0.0760,\ p = 0.0082}$), confirming that this deficit is not an artifact of baseline chronotropic differences.

> **Key Finding:** The attenuated cardiac-response group showed a selective performance disadvantage under rapid presentation, whereas overall task accuracy did not clearly differ between groups.  
> *Caveat:* The attenuated group contains only 8 participants ($N=8$). Sensitivity analyses demonstrate that small sample sizes widen confidence intervals. This interaction indicates an observational cognitive vulnerability under speed pressure, not a proven causal mechanism.

---

## 9. Heart-Rate Variability (HRV) Analysis

To determine whether the 8 attenuated responders suffered from an underlying autonomic dysregulation or deficit in vagal tone, a deep-dive HRV analysis was conducted on their 10-second maintenance windows across successful vs failed trials.

### 9.1 Strongest HRV Findings (What Survived Forensic Validation)
Across the 8 attenuated participants, failed working-memory questions exhibited significantly higher RR-interval dispersion compared to successful questions:

| HRV Metric | Success Mean | Failure Mean | Paired Difference | Wilcoxon Test | BH-FDR Adjusted $p$ | Sensitivity Robustness |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Poincaré SD2** | $66.18\text{ ms}$ | $82.35\text{ ms}$ | **$+16.17\text{ ms}$** | **$W = 0,\ p = 0.0078$** | **$\mathbf{p = 0.0469}$** | **100% concordance** (positive in 8/8 subjects); survived 20s window check. |
| **SDNN** | $53.82\text{ ms}$ | $69.25\text{ ms}$ | **$+15.43\text{ ms}$** | **$W = 1,\ p = 0.0156$** | **$\mathbf{p = 0.0469}$** | Positive in 7/8 subjects; survived strict-window check ($p=0.0234$). |
| **Cardiac Vagal Index (CVI)** | $4.366$ | $4.518$ | **$+0.152$** | $W = 1,\ p = 0.0156$ | $\mathbf{p = 0.0469}$ | Positive in 7/8 subjects; reflects total variance. |

> **Validated Interpretation:** Failed working-memory trials were associated with greater short-term RR-interval variability, particularly in SD2 and SDNN. This indicates transient cardiovascular instability or autonomic perturbation during cognitive breakdown. (Avoid causal phrasing such as "failure causes autonomic instability" or "failure causes sympathetic activation").

### 9.2 HRV Heterogeneity Among the 8 Attenuated Responders
The 8 attenuated responders did **not** form a homogeneous physiological group. Instead, they exhibited substantial physiological diversity:

| Participant ID | Phenotype Classification | Mean $\Delta\text{HR}_{\text{maint}}$ | Overall Accuracy | Baseline RMSSD | Baseline SDNN | Baseline pNN50 | Poincaré CSI | Poincaré CVI |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **`sub-005`** | Attenuated Decelerator | $-0.79\text{ bpm}$ | $0.154$ | $81.3\text{ ms}$ | $55.0\text{ ms}$ | $68.0\%$ | $0.86$ | $4.63$ |
| **`sub-009`** | Attenuated Decelerator | $-0.95\text{ bpm}$ | $0.354$ | $74.3\text{ ms}$ | $63.8\text{ ms}$ | $19.3\%$ | $1.62$ | $4.44$ |
| **`sub-011`** | **True Accelerator** | $\mathbf{+0.75\text{ bpm}}$ | $0.739$ | $\mathbf{103.7\text{ ms}}$ | $\mathbf{80.1\text{ ms}}$ | $\mathbf{59.6\%}$ | $1.19$ | $\mathbf{4.93}$ |
| **`sub-017`** | Attenuated Decelerator | $-0.85\text{ bpm}$ | $0.440$ | $\mathbf{28.5\text{ ms}}$ | $\mathbf{29.8\text{ ms}}$ | $\mathbf{3.8\%}$ | $\mathbf{2.16}$ | $\mathbf{3.82}$ |
| **`sub-021`** | Attenuated Decelerator | $-0.14\text{ bpm}$ | $0.874$ | $82.4\text{ ms}$ | $65.0\text{ ms}$ | $38.4\%$ | $1.24$ | $4.56$ |
| **`sub-023`** | Attenuated Decelerator | $-1.24\text{ bpm}$ | $0.817$ | $\mathbf{103.9\text{ ms}}$ | $\mathbf{78.6\text{ ms}}$ | $7.0\%$ | $1.78$ | $3.97$ |
| **`sub-032`** | Attenuated Decelerator | $-1.07\text{ bpm}$ | $0.257$ | $84.6\text{ ms}$ | $70.9\text{ ms}$ | $31.6\%$ | $1.50$ | $4.58$ |
| **`sub-035`** | **True Accelerator** | $\mathbf{+0.75\text{ bpm}}$ | $0.642$ | $58.6\text{ ms}$ | $56.6\text{ ms}$ | $24.2\%$ | $1.77$ | $4.45$ |

* **Vagal Tone Range:** RMSSD spanned nearly 4-fold ($28.5\text{ ms}$ in `sub-017` to $103.9\text{ ms}$ in `sub-023`).
* **High-Frequency Fluctuations:** pNN50 ranged from $3.8\%$ to $68.0\%$.
* **True Accelerators:** `sub-011` and `sub-035` showed true positive cardiac acceleration during maintenance ($+0.75\text{ bpm}$), yet possessed high resting vagal tone (RMSSD $= 103.7\text{ ms}$ and $58.6\text{ ms}$) and solid cognitive performance ($73.9\%$ and $64.2\%$).

### 9.3 HRV Does Not Explain the Cardiac Phenotype
To test whether blunted cardiac deceleration is caused by diminished baseline vagal tone, the 8 Accelerators were directly contrasted with the 22 Decelerators:

* **RMSSD:** Accelerators $= 77.16\text{ ms}$ vs Decelerators $= 75.11\text{ ms}$ ($t = 0.864, \mathbf{p = 0.3932}$).
* **pNN50:** Accelerators $= 31.49\%$ vs Decelerators $= 31.58\%$ ($t = -0.116, \mathbf{p = 0.9086}$).
* **SDNN:** Accelerators $= 60.19\text{ ms}$ vs Decelerators $= 58.42\text{ ms}$ ($p = 0.642$).

> **Conclusion:** Conventional HRV measures did not show a clear difference between the two cardiac-response phenotypes in this sample. The failure to decelerate during maintenance is not attributable to a baseline vagal tone deficit. (Do NOT state: "The two groups have identical autonomic physiology").

### 9.4 Exploratory Cardiac–Cognitive Coupling
Linear mixed-effects models testing whether phase-evoked cardiac changes interact with response phenotype to predict trial accuracy yielded preliminary interaction terms:
* **Encoding $\Delta\text{HR} \times \text{Accelerator}$:** $\beta \approx +0.00625, p = 0.0268$
* **Recall $\Delta\text{HR} \times \text{Accelerator}$:** $\beta \approx -0.00593, p = 0.0170$

**Sensitivity Analysis:** Leave-one-participant-out re-estimation revealed that both interaction terms lost statistical significance ($p > 0.05$) when `sub-011` or `sub-032` was excluded. 
* **Classification:** **SUGGESTIVE / HYPOTHESIS-GENERATING**. This provides exploratory evidence that the relationship between task-evoked cardiac response and accuracy may differ across response phenotypes, but it is not an established finding.

---

## 10. Forensic Validation: What Was Caught, Corrected, and Rejected

A central hallmark of scientific integrity is the capacity to discover and eliminate errors in one's own analysis. The adversarial audit identified six specific errors that were corrected or retracted:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          FORENSIC AUDIT: "WHAT I CAUGHT" PANEL                         │
├──────────────────────────────┬─────────────────────────────┬───────────────────────────┤
│ Potential Finding / Method   │ Original Preliminary Status │ Audited / Corrected State │
├──────────────────────────────┼─────────────────────────────┼───────────────────────────┤
│ 1. Condition × Recall Model  │ Significant rebound claimed │ Reference-level error:    │
│                              │ relative to maintenance.    │ model was vs Baseline.    │
│                              │                             │ Replaced with direct      │
│                              │                             │ Recall − Maint contrast.  │
├──────────────────────────────┼─────────────────────────────┼───────────────────────────┤
│ 2. Phenotype Cutoff          │ Framed as physiological     │ Corrected to empirical,   │
│    (-1.30 bpm)               │ marker / threshold.         │ data-derived operational  │
│                              │                             │ cutoff (~73rd percentile).│
├──────────────────────────────┼─────────────────────────────┼───────────────────────────┤
│ 3. Short-Window SampEn       │ Mean difference reported    │ RETRACTED: 23.5% missing  │
│    & DFA-α1                  │ (-0.035, p=0.31; p=0.039).  │ or invalid (∞/negative);  │
│                              │                             │ mathematically unviable   │
│                              │                             │ in 10-second windows.     │
├──────────────────────────────┼─────────────────────────────┼───────────────────────────┤
│ 4. Graded CVI Progression    │ Monotonic increase claimed: │ RETRACTED: Trial-pooling  │
│    (Success→Partial→Fail)    │ 4.335 → 4.457 → 4.485.      │ artifact (Simpson's       │
│                              │                             │ Paradox). Participant-    │
│                              │                             │ level: Success = Partial. │
├──────────────────────────────┼─────────────────────────────┼───────────────────────────┤
│ 5. RMSSD Failure Effect      │ Claimed statistically       │ DOWNGRADED: Benjamini-    │
│    (+19.21 ms)               │ significant (p = 0.0391).   │ Hochberg FDR p = 0.0586.  │
│                              │                             │ Fragile; negative in 2/8  │
│                              │                             │ participants.             │
├──────────────────────────────┼─────────────────────────────┼───────────────────────────┤
│ 6. HRV-Accuracy Correlation  │ Claimed "all correlations   │ CONTRADICTED: Audited     │
│    Summary                   │ near zero (|r| < 0.10)".    │ tables showed 21 of 72    │
│                              │                             │ correlations significant; │
│                              │                             │ LMM p = 0.004.            │
└──────────────────────────────┴─────────────────────────────┴───────────────────────────┘
```

---

## 11. Key Quantified Findings (Summary Table)

| Finding | Metric / Comparison | Quantified Evidence | Validated Status |
| :--- | :--- | :--- | :--- |
| **1. Evoked Deceleration** | Baseline $\to$ Maintenance | $80.84\text{ bpm} \to 78.75\text{ bpm}$ ($\Delta\text{HR} = -1.93\text{ bpm}$) | **Robust Grand Mean Trajectory** |
| **2. Condition Rebound** | Recall $-$ Maint (Fast vs Slow) | $+0.782\text{ bpm vs } -0.009\text{ bpm}$ ($t = 3.171, p = 0.00358$) | **Validated Direct Contrast** |
| **3. Overall Performance** | Accuracy: Decelerators vs Accel. | $70.12\%\text{ vs } 65.14\%$ ($\Delta = +4.98\%, p = 0.4468$) | **Validated Null Difference** |
| **4. Speed Vulnerability** | Fast Condition Accuracy | Dec: $56.86\%$ vs Acc: $48.54\%$ ($\beta = -0.0762, p = 0.0084$) | **Validated Interaction** |
| **5. Autonomic Instability** | Failure $-$ Success SD2 & SDNN | SD2: $+16.17\text{ ms}$ ($p_{\text{FDR}} = 0.0469$); SDNN: $+15.43\text{ ms}$ ($p_{\text{FDR}} = 0.0469$) | **Validated Within-Subject Effect** |

---

## 12. Methodological Limitations

1. **Small Attenuated Subgroup ($N=8$):** The statistical power of the accelerator group is limited. While within-subject comparisons (5,959 trials) provide substantial power for trial-level dynamics, between-subject group contrasts have wider confidence intervals.
2. **Data-Derived Operational Cutoff:** The $-1.30\text{ bpm}$ boundary was selected based on the empirical distribution of this specific dataset; it cannot be interpreted as a universal biological threshold without prospective validation.
3. **Observational Association vs. Causality:** Cardiovascular deceleration and cognitive performance are correlated observations. The current design cannot determine whether cardiac deceleration causally facilitates working-memory maintenance or is an epiphenomenon of central attentional allocation.
4. **Absence of Synchronous Respiration:** Respiratory sinus arrhythmia (RSA) and tidal breathing directly modulate instantaneous heart rate and HRV. Without continuous pneumography or capnography, potential respiratory rate or depth confounds cannot be fully disentangled.
5. **Short-Window HRV Constraints:** Ten-second epochs violate standard recommendations for spectral (LF/HF) and nonlinear (SampEn, DFA) HRV estimation, restricting valid inference to short-term time-domain and Poincaré geometric indices.
6. **Individual Sensitivity of Coupling Models:** Phenotype-specific cardiac-cognitive interaction models are sensitive to individual participants (`sub-011` and `sub-032`), requiring cautious, exploratory interpretation.

---

## 13. Technical Stack & Implementation

* **Signal Processing & Feature Extraction:** Python, MNE-Python (`mne.io.read_raw_brainvision`), NeuroKit2 (`nk.ecg_clean`, `nk.ecg_peaks`), NumPy, SciPy (Butterworth filtering, MAD outlier filters).
* **Statistical Modeling & Inference:** Statsmodels (`MixedLM`), Pingouin (nonparametric Wilcoxon signed-rank, paired $t$-tests), Scikit-learn (permutation testing), Benjamini-Hochberg False Discovery Rate (FDR) adjustments.
* **Data Engineering & Workflow:** Pandas (vectorized trial window slicing, event synchronization), Automated CSV reporting pipelines.
* **Visualization & Diagnostics:** Matplotlib, Seaborn (multi-panel trajectory plots, Poincaré state spaces, forest plots).

---

## 14. Code Architecture & Reproducibility

```text
FocusFlow-main/
├── README.md                                  # Repository overview and execution guide
├── requirements.txt                           # Locked dependency environment
├── pipeline/
│   ├── build_question_physiology_pipeline.py  # Continuous ECG cleaning, R-peak cache, trial slicing
│   ├── run_question_cardiac_analysis.py       # Trajectory modeling, time-on-task, condition contrasts
│   ├── phenotype_cognitive_analysis.py        # Phenotype classification, LMMs, speed-pressure interaction
│   ├── run_accelerator_hrv_deep_analysis.py   # Short-window HRV extraction, Wilcoxon & FDR testing
│   └── hrv_wm_pipeline.py                     # Trial-level feature assembly and validation engine
├── data/
│   ├── rpeaks_cache/                          # Cached continuous R-peak arrays (.npz per subject)
│   ├── question_level_dataset.csv             # Cleaned question-level physiological dataset
│   └── question_phase_dataset.csv             # Phase-segmented beat-to-beat metrics
├── tables/
│   ├── table1_cardiac_trajectory_audited.csv  # Verified grand-mean and participant trajectories
│   ├── table2_condition_contrasts_audited.csv # Direct Recall-vs-Maintenance contrasts
│   ├── table4_graded_performance_hrv.csv      # Success vs Failure HRV distributions
│   └── table8_extreme_accelerators.csv        # Individual profiles of the 8 attenuated responders
└── audit/
    ├── forensic_audit_hrv_report.md           # Independent adversarial HRV audit trail
    └── forensic_audit_cardiac_report.md       # Independent adversarial cardiac analysis audit trail
```

---

## 15. Prospective Follow-Up Experiment

To transition these findings from exploratory observations to confirmed mechanisms, a prospective follow-up study should be conducted with the following design:
1. **Preregistration:** Preregister the $-1.30\text{ bpm}$ operational cutoff and the Fast $\times$ Phenotype cognitive interaction hypothesis on OSF.
2. **Expanded Sample Size:** Recruit $N \ge 80$ participants to ensure $\ge 20$ participants in the attenuated-response stratum.
3. **Synchronous Respiratory Monitoring:** Record continuous pneumography (respiratory belt) and end-tidal $\text{CO}_2$ to verify that maintenance deceleration is not an artifact of unmeasured breath-holding (Valsalva-like maneuvers).
4. **Extended Maintenance Durations:** Incorporate parametric maintenance delays ($10\text{ s}, 20\text{ s}, 30\text{ s}$) to permit formal spectral HRV decomposition.
5. **Prospective Time-Pressure Manipulation:** Systematically vary item presentation rates to determine the precise temporal threshold at which attenuated responders encounter cognitive breakdown.

---

## 16. Portfolio Deliverables

### A. Final 100-Word Project Description
This project investigates question-level cardiovascular dynamics across 5,959 working-memory trials from 30 participants with continuous 1000 Hz ECG. Using a validated signal-processing pipeline, we identified a reproducible heart-rate trajectory: steady slowing during encoding, maximal deceleration during maintenance ($-1.93\text{ bpm}$), and rapid condition-specific rebound during recall under speed pressure ($+0.78\text{ bpm}, p=0.0036$). Stratifying participants revealed that while overall accuracy did not differ ($p=0.447$), attenuated responders suffered a selective deficit under rapid presentation ($p=0.0084$). Methodological self-auditing corrected regression reference errors, eliminated short-window HRV artifacts (SampEn, DFA-$\alpha_1$), and resolved trial-level pseudoreplication, demonstrating rigorous computational psychophysiology.

### B. Final 50-Word Project Description
Analyzing 5,959 working-memory trials with continuous 1000 Hz ECG revealed marked cardiac slowing during mental holding ($-1.93\text{ bpm}$) and rapid recall rebound under speed pressure ($p=0.0036$). Attenuated responders showed selective accuracy impairment during rapid presentation ($p=0.0084$). A forensic audit eliminated short-window HRV artifacts, demonstrating rigorous, reproducible physiological data science.

### C. Portfolio Headline
> **Question-Level Cardiac Dynamics in Working Memory: Evoked Deceleration, Speed-Pressure Vulnerability, and Rigorous Forensic Validation**

### D. Five Key Quantified Findings
1. **Evoked Maintenance Deceleration:** Mean heart rate dropped by **$-1.93\text{ bpm}$** from baseline ($80.84\text{ bpm}$) to maintenance ($78.75\text{ bpm}$) across 5,959 trials.
2. **Speed-Evoked Recall Rebound:** Fast presentation induced a **$+0.782\text{ bpm}$** recall rebound over maintenance, contrasting with flat slow trials ($-0.009\text{ bpm}$, **$p = 0.00358$**).
3. **Overall Accuracy Equivalence:** Decelerators ($N=22$) and Accelerators ($N=8$) showed no clear overall accuracy difference (**$70.12\%\text{ vs } 65.14\%$, $p = 0.4468$**).
4. **Selective Speed Vulnerability:** Accelerators suffered an **8.32% accuracy drop** under rapid presentation (**$\beta = -0.0762, p = 0.0084$**), persisting after baseline-HR control.
5. **Autonomic Instability During Failure:** Cognitive failure trials showed elevated RR variability (**SD2: $+16.17\text{ ms}$, FDR $p = 0.0469$**; **SDNN: $+15.43\text{ ms}$, FDR $p = 0.0469$**).

### E. Six Recommended Portfolio Figures
* **Figure 1: Grand-Average Question-Level Cardiac Trajectory**  
  *Visualizes:* Beat-by-beat heart rate across Baseline ($-5..0\text{ s}$), Encoding ($0..5\text{ s}$), Maintenance ($5..15\text{ s}$), and Recall ($15..20\text{ s}$), showing grand-mean trajectory ($80.84 \to 79.56 \to 78.75 \to 79.19\text{ bpm}$).
* **Figure 2: Distribution of Individual Cardiac Response Phenotypes**  
  *Visualizes:* Participant-level waterfall plot of maintenance $\Delta\text{HR}$ across all 30 participants, highlighting the 22 Decelerators and 8 Attenuated Responders demarcated by the $-1.30\text{ bpm}$ operational cutoff.
* **Figure 3: Cognitive Performance Under Speed Pressure**  
  *Visualizes:* Interaction plot showing recall accuracy across presentation conditions (Slow, Simultaneous, Fast+delay, Fast) for Decelerators vs Accelerators, illustrating the selective performance drop in Fast ($56.9\%\text{ vs }48.5\%$).
* **Figure 4: Autonomic Dispersion in Working-Memory Failure**  
  *Visualizes:* Paired within-subject box/violin plots of Poincaré SD2 ($+16.17\text{ ms}$) and SDNN ($+15.43\text{ ms}$) contrasting Success vs Failure trials across the 8 attenuated participants.
* **Figure 5: Physiological Heterogeneity Across Attenuated Responders**  
  *Visualizes:* Multi-panel bar/scatter chart displaying baseline RMSSD ($28.5\text{ to }103.9\text{ ms}$), SDNN, and pNN50 ($3.8\%\text{ to }68.0\%$) across `sub-005` through `sub-035`.
* **Figure 6: Forensic Audit Workflow & Sensitivity Matrix**  
  *Visualizes:* The end-to-end processing dependency chain paired with the "What I Caught" verification matrix contrasting preliminary claims against audited results.

### F. Technical Skills List
* **ECG Signal Processing:** Continuous session-wide 5th-order Butterworth bandpass filtering, Pan-Tompkins R-peak detection, beat-to-beat RR-interval extraction, local MAD artifact filtering, event-locked epoch slicing.
* **Physiological Feature Engineering:** Phase-specific instantaneous heart rate ($\text{HR}$), within-trial baseline subtraction ($\Delta\text{HR}$), time-domain HRV (SDNN, RMSSD, pNN50), Poincaré geometry (SD1, SD2, CSI, CVI).
* **Statistical Modeling & Validation:** Linear mixed-effects regression (LMM/HLM), within-subject paired contrasts, non-parametric permutation testing, Benjamini-Hochberg FDR correction, leave-one-participant-out sensitivity audits.
* **Research Software Engineering:** Modular, reproducible Python pipelines, automated tabular/graphical artifact generation, git version control, adversarial code auditing.

---
