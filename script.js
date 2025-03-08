function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN').format(amount);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log("Copied to clipboard: " + text);
    });
}

function calculateOldTax() {
    document.getElementById('taxSlabs').style.display = 'none';
    let income = parseFloat(document.getElementById('income').value);
    let deductions = 50000 + 2400 + 150000;
    let taxableIncome = Math.max(0, income - deductions);
    let tax = 0;
    let slabs = [
        [250000, 500000, 0.05],
        [500000, 1000000, 0.20],
        [1000000, Infinity, 0.30]
    ];
    for (let [lower, upper, rate] of slabs) {
        if (taxableIncome > lower) {
            let amount = Math.min(taxableIncome, upper) - lower;
            if (amount > 0) tax += amount * rate;
        }
    }
    console.log(taxableIncome, tax, deductions);
    return tax + tax * 0.04;
}

function calculateTax() {
    setTimeout(() => {
        document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    document.getElementById('taxSlabs').style.display = 'none';
    let income = parseFloat(document.getElementById('income').value);
    let standardDeduction = 75000;
    let taxableIncome = Math.max(0, income - standardDeduction);

    if (income <= 1200000) {
        document.getElementById('result').innerHTML = `<tr><td colspan='2'>Total tax to be paid: ₹0</td></tr>`;
        return;
    }

    let tax = 0;
    let slabs = [
        [400000, 800000, 0.05],
        [800000, 1200000, 0.10],
        [1200000, 1600000, 0.15],
        [1600000, 2000000, 0.20],
        [2000000, 2400000, 0.25],
        [2400000, Infinity, 0.30]
    ];

    let prevLimit = 0;
    for (let [lower, upper, rate] of slabs) {
        if (taxableIncome > lower) {
            let amount = Math.min(taxableIncome, upper) - Math.max(prevLimit, lower);
            if (amount > 0) tax += amount * rate;
            prevLimit = upper;
        }
    }

    let educationCess = tax * 0.04;
    let totalTax = tax + educationCess;

    let oldTax = calculateOldTax();
    let taxDifference = oldTax - totalTax;

    document.getElementById('result').innerHTML = `
        <tr><th>Description</th><th>Amount (₹)</th></tr>
        <tr><td>Total Income (A)</td><td class='copyable' onclick='copyToClipboard("${formatCurrency(income)}")'>₹${formatCurrency(income)}</td></tr>
        <tr><td>Standard Deduction (B)</td><td class='copyable' onclick='copyToClipboard("${formatCurrency(standardDeduction)}")'>₹${formatCurrency(standardDeduction)}</td></tr>
        <tr><td>Taxable Income (A-B)</td><td class='copyable' onclick='copyToClipboard("${formatCurrency(taxableIncome)}")'>₹${formatCurrency(taxableIncome)}</td></tr>
        <tr><td>Total tax (before cess) (C)</td><td class='copyable' onclick='copyToClipboard("${formatCurrency(tax)}")'>₹${formatCurrency(tax)}</td></tr>
        <tr><td>Education Cess (4%) (D)</td><td class='copyable' onclick='copyToClipboard("${formatCurrency(educationCess)}")'>₹${formatCurrency(educationCess)}</td></tr>
        <tr><td>Total tax to be paid (including cess) (C+D)</td><td class='copyable' onclick='copyToClipboard("${formatCurrency(totalTax)}")'>₹${formatCurrency(totalTax)}</td></tr>
        <tr class='tr-old'><td>Old Tax Regime Tax</td><td class='copyable' onclick='copyToClipboard("${formatCurrency(oldTax)}")'>₹${formatCurrency(oldTax)}</td></tr>
        <tr class='tr-old'><td>Difference (Old - New)</td><td class='copyable' onclick='copyToClipboard("${formatCurrency(taxDifference)}")'>₹${formatCurrency(taxDifference)}</td></tr>
    `;
}