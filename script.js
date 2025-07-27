document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const cvForm = document.getElementById('cvForm');
    const addEducationBtn = document.getElementById('addEducation');
    const addExperienceBtn = document.getElementById('addExperience');
    const addSkillBtn = document.getElementById('addSkill');
    const skillInput = document.getElementById('skillInput');
    const skillsList = document.getElementById('skillsList');
    const resetFormBtn = document.getElementById('resetForm');
    const printCVBtn = document.getElementById('printCV');
    const downloadCVBtn = document.getElementById('downloadCV');
    const cvPreview = document.getElementById('cvPreview');
    
    // Skills array
    let skills = [];
    
    // Add education entry
    addEducationBtn.addEventListener('click', function() {
        const educationEntries = document.querySelector('.education-entries');
        const newEntry = document.createElement('div');
        newEntry.className = 'education-entry';
        newEntry.innerHTML = `
            <div class="form-group">
                <label>Degree</label>
                <input type="text" class="degree" required>
            </div>
            <div class="form-group">
                <label>Institution</label>
                <input type="text" class="institution" required>
            </div>
            <div class="form-group">
                <label>Year</label>
                <input type="text" class="education-year" required>
            </div>
            <button type="button" class="remove-education btn-danger">Remove</button>
        `;
        educationEntries.appendChild(newEntry);
        
        // Add event listener to the new remove button
        newEntry.querySelector('.remove-education').addEventListener('click', function() {
            educationEntries.removeChild(newEntry);
        });
    });
    
    // Add experience entry
    addExperienceBtn.addEventListener('click', function() {
        const experienceEntries = document.querySelector('.experience-entries');
        const newEntry = document.createElement('div');
        newEntry.className = 'experience-entry';
        newEntry.innerHTML = `
            <div class="form-group">
                <label>Job Title</label>
                <input type="text" class="job-title" required>
            </div>
            <div class="form-group">
                <label>Company</label>
                <input type="text" class="company" required>
            </div>
            <div class="form-group">
                <label>Duration</label>
                <input type="text" class="duration" placeholder="e.g. 2018-2020" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="job-description" rows="3"></textarea>
            </div>
            <button type="button" class="remove-experience btn-danger">Remove</button>
        `;
        experienceEntries.appendChild(newEntry);
        
        // Add event listener to the new remove button
        newEntry.querySelector('.remove-experience').addEventListener('click', function() {
            experienceEntries.removeChild(newEntry);
        });
    });
    
    // Add skill
    addSkillBtn.addEventListener('click', function() {
        const skill = skillInput.value.trim();
        if (skill && !skills.includes(skill)) {
            skills.push(skill);
            updateSkillsList();
            skillInput.value = '';
        }
    });
    
    // Also add skill when pressing Enter
    skillInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkillBtn.click();
        }
    });
    
    // Update skills list display
    function updateSkillsList() {
        skillsList.innerHTML = '';
        skills.forEach((skill, index) => {
            const skillTag = document.createElement('div');
            skillTag.className = 'skill-tag';
            skillTag.innerHTML = `
                ${skill}
                <button type="button" class="remove-skill" data-index="${index}">&times;</button>
            `;
            skillsList.appendChild(skillTag);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-skill').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                skills.splice(index, 1);
                updateSkillsList();
            });
        });
    }
    
    // Reset form
    resetFormBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
            cvForm.reset();
            document.querySelector('.education-entries').innerHTML = '';
            document.querySelector('.experience-entries').innerHTML = '';
            skills = [];
            updateSkillsList();
            cvPreview.innerHTML = '<div class="cv-placeholder"><p>Your CV will appear here after you fill the form</p></div>';
            printCVBtn.disabled = true;
            downloadCVBtn.disabled = true;
            
            // Add one empty education and experience entry
            addEducationBtn.click();
            addExperienceBtn.click();
        }
    });
    
    // Print CV
    printCVBtn.addEventListener('click', function() {
        window.print();
    });
    
    // Download as PDF (using browser's print to PDF functionality)
    downloadCVBtn.addEventListener('click', function() {
        window.print();
    });
    
    // Form submission
    cvForm.addEventListener('submit', function(e) {
        e.preventDefault();
        generateCV();
    });
    
    // Generate CV from form data
    function generateCV() {
        // Get personal information
        const fullName = document.getElementById('fullName').value;
        const profession = document.getElementById('profession').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const about = document.getElementById('about').value;
        const photoUrl = document.getElementById('photo').value;
        
        // Get education entries
        const educationEntries = [];
        document.querySelectorAll('.education-entry').forEach(entry => {
            educationEntries.push({
                degree: entry.querySelector('.degree').value,
                institution: entry.querySelector('.institution').value,
                year: entry.querySelector('.education-year').value
            });
        });
        
        // Get experience entries
        const experienceEntries = [];
        document.querySelectorAll('.experience-entry').forEach(entry => {
            experienceEntries.push({
                jobTitle: entry.querySelector('.job-title').value,
                company: entry.querySelector('.company').value,
                duration: entry.querySelector('.duration').value,
                description: entry.querySelector('.job-description').value
            });
        });
        
        // Generate CV HTML
        let cvHTML = `
            <div class="cv-template">
                <div class="cv-header">
                    ${photoUrl ? `<img src="${photoUrl}" alt="Profile Photo" class="cv-photo">` : ''}
                    <div>
                        <h1 class="cv-name">${fullName}</h1>
                        <h2 class="cv-profession">${profession}</h2>
                        <div class="cv-contact">
                            ${email ? `<span class="cv-contact-item"><i class="fas fa-envelope"></i> ${email}</span>` : ''}
                            ${phone ? `<span class="cv-contact-item"><i class="fas fa-phone"></i> ${phone}</span>` : ''}
                            ${address ? `<span class="cv-contact-item"><i class="fas fa-map-marker-alt"></i> ${address}</span>` : ''}
                        </div>
                    </div>
                </div>
                
                ${about ? `
                <div class="cv-section">
                    <h2 class="cv-section-title">About Me</h2>
                    <p class="cv-about">${about.replace(/\n/g, '<br>')}</p>
                </div>
                ` : ''}
                
                ${educationEntries.length > 0 ? `
                <div class="cv-section">
                    <h2 class="cv-section-title">Education</h2>
                    ${educationEntries.map(edu => `
                        <div class="cv-education-item">
                            <h3 class="cv-education-degree">${edu.degree}</h3>
                            <p class="cv-education-institution">${edu.institution}</p>
                            <p class="cv-education-year">${edu.year}</p>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${experienceEntries.length > 0 ? `
                <div class="cv-section">
                    <h2 class="cv-section-title">Experience</h2>
                    ${experienceEntries.map(exp => `
                        <div class="cv-experience-item">
                            <h3 class="cv-experience-title">${exp.jobTitle}</h3>
                            <p class="cv-experience-company">${exp.company}</p>
                            <p class="cv-experience-duration">${exp.duration}</p>
                            ${exp.description ? `<div class="cv-experience-description">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${skills.length > 0 ? `
                <div class="cv-section">
                    <h2 class="cv-section-title">Skills</h2>
                    <div class="cv-skills">
                        ${skills.map(skill => `<span class="cv-skill">${skill}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
        // Update preview
        cvPreview.innerHTML = cvHTML;
        
        // Enable print and download buttons
        printCVBtn.disabled = false;
        downloadCVBtn.disabled = false;
    }
    
    // Initialize form with one education and one experience entry
    addEducationBtn.click();
    addExperienceBtn.click();
});