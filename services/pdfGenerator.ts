
import { jsPDF } from "jspdf";
import { metacognaProfile } from "../data/profile";

export const generateProspectusPDF = () => {
    const doc = new jsPDF();
    
    // --- CONFIGURATION ---
    const margin = 20;
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297;
    const contentWidth = pageWidth - (margin * 2);
    let y = 20;

    // Colors (RGB)
    const COLOR_INK = [24, 24, 27];      // #18181b
    const COLOR_ACCENT = [16, 185, 129]; // #10b981 (Emerald)
    const COLOR_PAPER = [255, 255, 255]; // #ffffff
    const COLOR_SURFACE = [244, 244, 245]; // #f4f4f5

    // --- HELPERS ---

    const setFont = (type: 'heading' | 'body' | 'mono' | 'mono-bold', size: number = 10, color: number[] = COLOR_INK) => {
        doc.setTextColor(color[0], color[1], color[2]);
        doc.setFontSize(size);
        switch (type) {
            case 'heading': doc.setFont("times", "bold"); break; // Using Times as proxy for Serif/Playfair
            case 'body': doc.setFont("helvetica", "normal"); break; // Inter proxy
            case 'mono': doc.setFont("courier", "normal"); break; // JetBrains Proxy
            case 'mono-bold': doc.setFont("courier", "bold"); break;
        }
    };

    const drawHardShadowRect = (x: number, y: number, w: number, h: number, fillColor: number[], shadowColor: number[] = COLOR_INK) => {
        // Shadow
        doc.setFillColor(shadowColor[0], shadowColor[1], shadowColor[2]);
        doc.rect(x + 1.5, y + 1.5, w, h, 'F');
        // Main
        doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
        doc.setDrawColor(shadowColor[0], shadowColor[1], shadowColor[2]);
        doc.setLineWidth(0.5);
        doc.rect(x, y, w, h, 'FD');
    };

    const checkPage = (heightNeeded: number) => {
        if (y + heightNeeded > pageHeight - margin) {
            doc.addPage();
            y = 20;
            // Header for continuation pages
            doc.setFillColor(COLOR_SURFACE[0], COLOR_SURFACE[1], COLOR_SURFACE[2]);
            doc.rect(0, 0, pageWidth, 15, 'F');
            setFont('mono-bold', 8, [150, 150, 150]);
            doc.text("METACOGNA_LAB // CONTINUATION_SHEET", margin, 10);
            y = 30;
        }
    };

    const addSectionHeader = (title: string, subtitle?: string) => {
        checkPage(25);
        
        // Stylish Divider
        doc.setDrawColor(COLOR_INK[0], COLOR_INK[1], COLOR_INK[2]);
        doc.setLineWidth(0.5);
        doc.line(margin, y, margin + contentWidth, y);
        
        // Green accent block under line
        doc.setFillColor(COLOR_ACCENT[0], COLOR_ACCENT[1], COLOR_ACCENT[2]);
        doc.rect(margin, y, 4, 8, 'F');

        y += 6;

        setFont('mono-bold', 12, COLOR_INK);
        doc.text(title.toUpperCase(), margin + 6, y);
        
        if (subtitle) {
            y += 5;
            setFont('mono', 9, [100, 100, 100]);
            doc.text(subtitle, margin + 6, y);
        }
        
        y += 10;
    };

    const addWrappedText = (text: string, size: number, type: 'body' | 'mono', color: number[], indent: number = 0) => {
        setFont(type, size, color);
        const lineHeight = size / 2.5; 
        const lines = doc.splitTextToSize(text, contentWidth - indent);
        checkPage(lines.length * lineHeight);
        doc.text(lines, margin + indent, y);
        y += (lines.length * lineHeight) + 2;
    };

    // --- DOCUMENT CONTENT ---

    // 1. BRAND HEADER
    // Draw Branding Block
    drawHardShadowRect(margin, y, 100, 35, COLOR_ACCENT, COLOR_INK);
    
    doc.setTextColor(COLOR_INK[0], COLOR_INK[1], COLOR_INK[2]);
    doc.setFont("times", "bold");
    doc.setFontSize(24);
    doc.text("METACOGNA LAB", margin + 6, y + 14);
    
    setFont('mono-bold', 10, COLOR_INK);
    doc.text("STRATEGIC PROSPECTUS // V.2025", margin + 6, y + 24);
    
    // Address Block (Right aligned)
    const addressX = pageWidth - margin;
    let addrY = y + 5;
    setFont('mono-bold', 9, COLOR_INK);
    
    const addressLines = [
        "Metacogna Lab",
        "hi@metacogna.ai",
        "Upside Down Land",
        "Earth, Solar System",
        "Milky Way, Local Cluster"
    ];
    
    addressLines.forEach(line => {
        doc.text(line, addressX, addrY, { align: "right" });
        addrY += 5;
    });

    y += 50;

    // 2. MISSION STATEMENT
    // Styled as a "Terminal" or "Card"
    const missionText = metacognaProfile.methodology.description;
    
    // Background for mission
    setFont('body', 10);
    const splitMission = doc.splitTextToSize(missionText, contentWidth - 10);
    const boxHeight = (splitMission.length * 5) + 20;
    
    drawHardShadowRect(margin, y, contentWidth, boxHeight, COLOR_PAPER, COLOR_INK);
    
    // Badge Label inside
    doc.setFillColor(COLOR_INK[0], COLOR_INK[1], COLOR_INK[2]);
    doc.rect(margin + 5, y + 5, 35, 6, 'F');
    setFont('mono-bold', 8, COLOR_PAPER);
    doc.text("MISSION_LOG", margin + 7, y + 9);
    
    // Text
    setFont('mono', 10, COLOR_INK);
    doc.text(splitMission, margin + 5, y + 20);

    y += boxHeight + 15;

    // 3. METHODOLOGY
    addSectionHeader("01 // METHODOLOGY", "Controlled Chaos & Rigorous Design");
    
    // Tagline quote style
    doc.setDrawColor(COLOR_ACCENT[0], COLOR_ACCENT[1], COLOR_ACCENT[2]);
    doc.setLineWidth(1);
    doc.line(margin, y, margin, y + 10); // Left green border
    
    addWrappedText(`"${metacognaProfile.methodology.tagline}"`, 11, 'body', COLOR_INK, 5);
    y += 5;
    addWrappedText(metacognaProfile.methodology.cyclePhilosophy, 10, 'mono', [80, 80, 80], 5);
    y += 10;

    // 4. SERVICE ARCHITECTURE
    addSectionHeader("02 // SERVICE ARCHITECTURE", "The Operational Stack");

    const categories = [
        { title: "I. EXECUTIVE OPERATIONS", items: metacognaProfile.services.executiveOps },
        { title: "II. SOLUTIONS DESIGN", items: metacognaProfile.services.solutionsDesign },
        { title: "III. TECHNICAL EXECUTION", items: metacognaProfile.services.technical },
    ];

    categories.forEach(cat => {
        checkPage(30);
        // Category Header
        doc.setFillColor(COLOR_INK[0], COLOR_INK[1], COLOR_INK[2]);
        doc.rect(margin, y, contentWidth, 8, 'F');
        setFont('mono-bold', 10, COLOR_PAPER);
        doc.text(cat.title, margin + 3, y + 5);
        y += 12;

        cat.items.forEach(item => {
            checkPage(30);
            
            // Service Item Title with small green square
            doc.setFillColor(COLOR_ACCENT[0], COLOR_ACCENT[1], COLOR_ACCENT[2]);
            doc.rect(margin, y - 3, 2, 2, 'F');
            
            setFont('heading', 11, COLOR_INK);
            doc.text(item.name, margin + 4, y);
            y += 5;
            
            // Description
            addWrappedText(item.description, 9, 'body', [60, 60, 60], 4);
            
            // Tags
            setFont('mono', 8, [120, 120, 120]);
            doc.text(`[${item.tags.join('] [')}]`, margin + 4, y);
            y += 8;
        });
        y += 5;
    });

    // 5. ENGAGEMENT MODELS
    addSectionHeader("03 // ENGAGEMENT MODELS", "Time-Boxed Value Delivery");

    metacognaProfile.engagementModels.forEach(model => {
        checkPage(40);
        
        doc.setDrawColor(COLOR_ACCENT[0], COLOR_ACCENT[1], COLOR_ACCENT[2]);
        doc.setLineWidth(0.5);
        doc.line(margin, y, margin + 40, y); // Small top accent
        y += 5;

        setFont('mono-bold', 12, COLOR_INK);
        doc.text(model.name.toUpperCase(), margin, y);
        
        setFont('mono-bold', 10, COLOR_ACCENT);
        const durationText = `DURATION: ${model.duration}`;
        const durationWidth = doc.getTextWidth(durationText);
        doc.text(durationText, pageWidth - margin - durationWidth, y);
        
        y += 6;
        setFont('body', 10, COLOR_INK);
        doc.text(`FOCUS: ${model.focus}`, margin, y);
        y += 6;
        
        setFont('mono', 9, [80, 80, 80]);
        const deliverables = `DELIVERABLES: ${model.deliverables.join(" // ")}`;
        const splitDeliv = doc.splitTextToSize(deliverables, contentWidth);
        doc.text(splitDeliv, margin, y);
        y += (splitDeliv.length * 4) + 10;
    });

    // 6. CLOSING / FOOTER
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Bottom Line
        doc.setDrawColor(COLOR_INK[0], COLOR_INK[1], COLOR_INK[2]);
        doc.setLineWidth(0.5);
        doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

        setFont('mono-bold', 8, [150, 150, 150]);
        const dateStr = new Date().toISOString().split('T')[0];
        doc.text(`PAGE ${i} OF ${pageCount} // GENERATED: ${dateStr}`, margin, pageHeight - 10);
        doc.text("METACOGNA LAB // CONFIDENTIAL", pageWidth - margin - 50, pageHeight - 10);
    }

    doc.save("Metacogna_Prospectus_2025.pdf");
};
