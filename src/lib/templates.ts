/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FormSchema, TemplateCategory, FormTemplate } from "@/types";
import { DEFAULT_FORM_SETTINGS } from "./constants";
import { generateId } from "./utils";
import { DEFAULT_THEME } from "@/types/form-theme";


const f = (
  type: any,
  label: string,
  name: string,
  extra: Record<string, any> = {}
) => ({
  id: generateId("field"),
  type,
  label,
  name,
  required: false,
  ...extra,
});

const base = (title: string, description = ""): FormSchema => ({
  id: generateId("form"),
  title,
  description,
  fields: [],
  settings: {
    ...DEFAULT_FORM_SETTINGS,
    theme: { ...DEFAULT_THEME },
  },
});

const withFields = (title: string, description: string, fields: any[]): FormSchema => ({
  ...base(title, description),
  fields,
});


export const templates: FormTemplate[] = [

  {
    id: "blank",
    name: "Blank Form",
    description: "Start from scratch",
    icon: "📝",
    category: "Business",
    build: () => base("Untitled Form"),
  },

  {
    id: "contact-simple",
    name: "Contact Form",
    description: "Basic contact with message",
    icon: "✉️",
    category: "Contact",
    build: () =>
      withFields("Contact Us", "We'd love to hear from you.", [
        f("text", "Full Name", "fullName", { required: true }),
        f("email", "Email", "email", { required: true }),
        f("textarea", "Message", "message", {
          required: true,
          rows: 4,
        }),
      ]),
  },
  {
    id: "contact-detailed",
    name: "Detailed Contact",
    description: "Complete contact info",
    icon: "📇",
    category: "Contact",
    build: () =>
      withFields("Get in Touch", "Send us a detailed message.", [
        f("text", "First Name", "firstName", { required: true }),
        f("text", "Last Name", "lastName", { required: true }),
        f("email", "Email", "email", { required: true }),
        f("tel", "Phone", "phone"),
        f("text", "Company", "company"),
        f("select", "Department", "department", {
          options: [
            { label: "Sales", value: "sales" },
            { label: "Support", value: "support" },
            { label: "General", value: "general" },
          ],
        }),
        f("textarea", "Message", "message", { required: true, rows: 5 }),
      ]),
  },
  {
    id: "contact-feedback",
    name: "Quick Feedback",
    description: "Simple feedback form",
    icon: "💬",
    category: "Feedback",
    build: () =>
      withFields("Quick Feedback", "Help us improve.", [
        f("text", "Name", "name"),
        f("radio", "Overall Rating", "rating", {
          required: true,
          options: [
            { label: "Excellent", value: "excellent" },
            { label: "Good", value: "good" },
            { label: "Average", value: "average" },
            { label: "Poor", value: "poor" },
          ],
        }),
        f("textarea", "Suggestions", "suggestions", { rows: 3 }),
      ]),
  },

  {
    id: "invoice-request",
    name: "Invoice Request",
    description: "Request an invoice",
    icon: "🧾",
    category: "Business",
    build: () =>
      withFields(
        "Invoice Request",
        "Fill out to request an invoice.",
        [
          f("text", "Company Name", "companyName", { required: true }),
          f("email", "Billing Email", "billingEmail", { required: true }),
          f("text", "Invoice Number", "invoiceNumber"),
          f("date", "Invoice Date", "invoiceDate", { required: true }),
          f("date", "Due Date", "dueDate", { required: true }),
          f("number", "Amount", "amount", { required: true }),
          f("textarea", "Notes", "notes", { rows: 3 }),
        ]
      ),
  },
  {
    id: "quote-request",
    name: "Quote Request",
    description: "Get a price quote",
    icon: "💰",
    category: "Business",
    build: () =>
      withFields("Request a Quote", "Tell us about your needs.", [
        f("text", "Full Name", "fullName", { required: true }),
        f("email", "Email", "email", { required: true }),
        f("tel", "Phone", "phone"),
        f("text", "Company", "company", { required: true }),
        f("select", "Service Type", "serviceType", {
          required: true,
          options: [
            { label: "Web Development", value: "web" },
            { label: "Mobile App", value: "mobile" },
            { label: "Design", value: "design" },
            { label: "Consulting", value: "consulting" },
          ],
        }),
        f("textarea", "Project Details", "details", {
          required: true,
          rows: 5,
        }),
        f("select", "Budget Range", "budget", {
          options: [
            { label: "Under $5,000", value: "under-5k" },
            { label: "$5,000 - $20,000", value: "5k-20k" },
            { label: "$20,000 - $50,000", value: "20k-50k" },
            { label: "Over $50,000", value: "over-50k" },
          ],
        }),
      ]),
  },
  {
    id: "purchase-order",
    name: "Purchase Order",
    description: "Product order form",
    icon: "🛒",
    category: "Business",
    build: () =>
      withFields("Purchase Order", "Order products or services.", [
        f("text", "Customer Name", "customerName", { required: true }),
        f("email", "Email", "email", { required: true }),
        f("text", "Product Name", "productName", { required: true }),
        f("number", "Quantity", "quantity", {
          required: true,
          min: 1,
        }),
        f("number", "Unit Price", "unitPrice", { required: true, min: 0 }),
        f("textarea", "Special Instructions", "instructions", { rows: 3 }),
        f("select", "Payment Method", "paymentMethod", {
          required: true,
          options: [
            { label: "Credit Card", value: "card" },
            { label: "Bank Transfer", value: "bank" },
            { label: "Cash on Delivery", value: "cod" },
          ],
        }),
      ]),
  },
  {
    id: "lead-capture",
    name: "Lead Capture",
    description: "Capture potential customers",
    icon: "🎯",
    category: "Business",
    build: () =>
      withFields("Get Started", "Sign up for a free consultation.", [
        f("text", "Full Name", "fullName", { required: true }),
        f("email", "Work Email", "email", { required: true }),
        f("tel", "Phone", "phone", { required: true }),
        f("text", "Company", "company", { required: true }),
        f("select", "Company Size", "companySize", {
          options: [
            { label: "1-10", value: "1-10" },
            { label: "11-50", value: "11-50" },
            { label: "51-200", value: "51-200" },
            { label: "200+", value: "200+" },
          ],
        }),
        f("textarea", "What are you looking for?", "needs", { rows: 3 }),
      ]),
  },
  {
    id: "meeting-request",
    name: "Meeting Request",
    description: "Schedule a meeting",
    icon: "📅",
    category: "Business",
    build: () =>
      withFields("Request a Meeting", "Schedule time with us.", [
        f("text", "Your Name", "name", { required: true }),
        f("email", "Email", "email", { required: true }),
        f("date", "Preferred Date", "preferredDate", { required: true }),
        f("time", "Preferred Time", "preferredTime", { required: true }),
        f("select", "Duration", "duration", {
          options: [
            { label: "15 minutes", value: "15" },
            { label: "30 minutes", value: "30" },
            { label: "1 hour", value: "60" },
          ],
        }),
        f("textarea", "Agenda", "agenda", { rows: 4 }),
      ]),
  },
  {
    id: "partnership",
    name: "Partnership Inquiry",
    description: "Business partnership form",
    icon: "🤝",
    category: "Business",
    build: () =>
      withFields(
        "Partnership Inquiry",
        "Let's explore opportunities together.",
        [
          f("text", "Company Name", "company", { required: true }),
          f("text", "Contact Person", "contactPerson", { required: true }),
          f("email", "Email", "email", { required: true }),
          f("url", "Website", "website"),
          f("select", "Partnership Type", "partnershipType", {
            required: true,
            options: [
              { label: "Reseller", value: "reseller" },
              { label: "Integration", value: "integration" },
              { label: "Affiliate", value: "affiliate" },
              { label: "Other", value: "other" },
            ],
          }),
          f("textarea", "Proposal", "proposal", { rows: 5, required: true }),
        ]
      ),
  },
  {
    id: "customer-satisfaction",
    name: "Customer Satisfaction",
    description: "CSAT survey",
    icon: "😊",
    category: "Feedback",
    build: () =>
      withFields("Customer Satisfaction", "How did we do?", [
        f("text", "Your Name", "name"),
        f("rating", "Overall Satisfaction", "satisfaction", {
          required: true,
          max: 5,
        }),
        f("radio", "Would you recommend us?", "recommend", {
          required: true,
          options: [
            { label: "Definitely", value: "definitely" },
            { label: "Probably", value: "probably" },
            { label: "Not sure", value: "not-sure" },
            { label: "Probably not", value: "probably-not" },
            { label: "Definitely not", value: "definitely-not" },
          ],
        }),
        f("textarea", "Comments", "comments", { rows: 4 }),
      ]),
  },

  {
    id: "job-application",
    name: "Job Application",
    description: "Complete application form",
    icon: "💼",
    category: "HR",
    build: () =>
      withFields("Job Application", "Apply for the position.", [
        f("text", "Full Name", "fullName", { required: true }),
        f("email", "Email", "email", { required: true }),
        f("tel", "Phone", "phone", { required: true }),
        f("url", "Portfolio / LinkedIn", "portfolio"),
        f("number", "Years of Experience", "experience", {
          required: true,
          min: 0,
        }),
        f("select", "Highest Education", "education", {
          options: [
            { label: "High School", value: "high-school" },
            { label: "Bachelor's", value: "bachelors" },
            { label: "Master's", value: "masters" },
            { label: "PhD", value: "phd" },
          ],
        }),
        f("textarea", "Cover Letter", "coverLetter", {
          required: true,
          rows: 5,
        }),
        f("file", "Resume (PDF)", "resume", {
          required: true,
          accept: ".pdf,.doc,.docx",
          multiple: false,
        }),
      ]),
  },
  {
    id: "leave-request",
    name: "Leave Request",
    description: "Employee leave form",
    icon: "🏖️",
    category: "HR",
    build: () =>
      withFields("Leave Request", "Submit your leave request.", [
        f("text", "Employee Name", "employeeName", { required: true }),
        f("text", "Employee ID", "employeeId", { required: true }),
        f("select", "Leave Type", "leaveType", {
          required: true,
          options: [
            { label: "Annual Leave", value: "annual" },
            { label: "Sick Leave", value: "sick" },
            { label: "Personal Leave", value: "personal" },
            { label: "Maternity/Paternity", value: "parental" },
          ],
        }),
        f("date", "Start Date", "startDate", { required: true }),
        f("date", "End Date", "endDate", { required: true }),
        f("number", "Total Days", "totalDays", { required: true, min: 1 }),
        f("textarea", "Reason", "reason", { rows: 4 }),
      ]),
  },
  {
    id: "performance-review",
    name: "Performance Review",
    description: "Annual review form",
    icon: "📊",
    category: "HR",
    build: () =>
      withFields("Performance Review", "Annual self-assessment.", [
        f("text", "Employee Name", "employeeName", { required: true }),
        f("text", "Position", "position", { required: true }),
        f("date", "Review Period", "reviewPeriod"),
        f("rating", "Overall Performance", "performance", {
          required: true,
          max: 5,
        }),
        f("textarea", "Key Achievements", "achievements", {
          required: true,
          rows: 4,
        }),
        f("textarea", "Areas for Growth", "growth", { rows: 4 }),
        f("textarea", "Goals for Next Year", "goals", { rows: 4 }),
      ]),
  },
  {
    id: "timesheet",
    name: "Timesheet",
    description: "Weekly timesheet",
    icon: "⏰",
    category: "HR",
    build: () =>
      withFields("Timesheet", "Log your working hours.", [
        f("text", "Employee Name", "employeeName", { required: true }),
        f("date", "Week Starting", "weekStart", { required: true }),
        f("number", "Monday Hours", "monday", { min: 0, max: 24 }),
        f("number", "Tuesday Hours", "tuesday", { min: 0, max: 24 }),
        f("number", "Wednesday Hours", "wednesday", { min: 0, max: 24 }),
        f("number", "Thursday Hours", "thursday", { min: 0, max: 24 }),
        f("number", "Friday Hours", "friday", { min: 0, max: 24 }),
        f("textarea", "Notes", "notes", { rows: 3 }),
      ]),
  },
  {
    id: "exit-interview",
    name: "Exit Interview",
    description: "Employee departure survey",
    icon: "🚪",
    category: "HR",
    build: () =>
      withFields("Exit Interview", "Help us improve.", [
        f("text", "Employee Name", "employeeName", { required: true }),
        f("date", "Last Working Day", "lastDay", { required: true }),
        f("select", "Reason for Leaving", "reason", {
          required: true,
          options: [
            { label: "Better Opportunity", value: "opportunity" },
            { label: "Relocation", value: "relocation" },
            { label: "Personal Reasons", value: "personal" },
            { label: "Work Environment", value: "environment" },
          ],
        }),
        f("rating", "Overall Experience", "experience", { max: 5 }),
        f("textarea", "What did you enjoy most?", "enjoyed", { rows: 4 }),
        f("textarea", "What could be improved?", "improvements", { rows: 4 }),
        f("checkbox", "Would you recommend us?", "recommend"),
      ]),
  },

  {
    id: "event-rsvp",
    name: "Event RSVP",
    description: "Simple RSVP form",
    icon: "🎟️",
    category: "Events",
    build: () =>
      withFields("RSVP", "Will you join us?", [
        f("text", "Your Name", "name", { required: true }),
        f("email", "Email", "email", { required: true }),
        f("radio", "Are you attending?", "attending", {
          required: true,
          options: [
            { label: "Yes, I'll be there!", value: "yes" },
            { label: "No, sorry", value: "no" },
            { label: "Maybe", value: "maybe" },
          ],
        }),
        f("number", "Number of Guests", "guests", { min: 0, max: 10 }),
        f("textarea", "Dietary Restrictions", "dietary", { rows: 2 }),
      ]),
  },
  {
    id: "event-registration",
    name: "Event Registration",
    description: "Full registration form",
    icon: "📝",
    category: "Events",
    build: () =>
      withFields("Event Registration", "Register for our event.", [
        f("text", "Full Name", "fullName", { required: true }),
        f("email", "Email", "email", { required: true }),
        f("tel", "Phone", "phone", { required: true }),
        f("text", "Organization", "organization"),
        f("select", "Ticket Type", "ticketType", {
          required: true,
          options: [
            { label: "General Admission", value: "general" },
            { label: "VIP", value: "vip" },
            { label: "Student", value: "student" },
          ],
        }),
        f("select", "Session Preference", "session", {
          options: [
            { label: "Morning", value: "morning" },
            { label: "Afternoon", value: "afternoon" },
            { label: "Full Day", value: "full" },
          ],
        }),
        f("checkbox", "I agree to the terms", "terms", { required: true }),
      ]),
  },
  {
    id: "ticket-booking",
    name: "Ticket Booking",
    description: "Book event tickets",
    icon: "🎫",
    category: "Events",
    build: () =>
      withFields("Book Your Tickets", "Reserve your spot.", [
        f("text", "Full Name", "fullName", { required: true }),
        f("email", "Email", "email", { required: true }),
        f("tel", "Phone", "phone", { required: true }),
        f("select", "Ticket Tier", "tier", {
          required: true,
          options: [
            { label: "Bronze - $49", value: "bronze" },
            { label: "Silver - $99", value: "silver" },
            { label: "Gold - $199", value: "gold" },
          ],
        }),
        f("number", "Quantity", "quantity", {
          required: true,
          min: 1,
          max: 10,
        }),
        f("date", "Event Date", "eventDate", { required: true }),
      ]),
  },
  {
    id: "speaker-proposal",
    name: "Speaker Proposal",
    description: "Submit a talk proposal",
    icon: "🎤",
    category: "Events",
    build: () =>
      withFields("Speaker Proposal", "Share your talk idea.", [
        f("text", "Speaker Name", "speakerName", { required: true }),
        f("email", "Email", "email", { required: true }),
        f("text", "Talk Title", "talkTitle", { required: true }),
        f("textarea", "Abstract", "abstract", { required: true, rows: 5 }),
        f("select", "Talk Length", "length", {
          options: [
            { label: "Lightning (5 min)", value: "5" },
            { label: "Short (15 min)", value: "15" },
            { label: "Standard (30 min)", value: "30" },
            { label: "Workshop (90 min)", value: "90" },
          ],
        }),
        f("url", "Previous Talk Link", "previousTalk"),
        f("url", "LinkedIn", "linkedin"),
      ]),
  },
  {
    id: "event-feedback",
    name: "Event Feedback",
    description: "Post-event survey",
    icon: "🌟",
    category: "Events",
    build: () =>
      withFields("Event Feedback", "How was the event?", [
        f("rating", "Overall Rating", "overall", { required: true, max: 5 }),
        f("rating", "Content Quality", "content", { max: 5 }),
        f("rating", "Speaker Quality", "speaker", { max: 5 }),
        f("rating", "Venue", "venue", { max: 5 }),
        f("textarea", "Favorite Part", "favorite", { rows: 3 }),
        f("textarea", "Suggestions", "suggestions", { rows: 3 }),
      ]),
  },

  {
    id: "nps-survey",
    name: "NPS Survey",
    description: "Net Promoter Score",
    icon: "📈",
    category: "Feedback",
    build: () =>
      withFields("NPS Survey", "How likely are you to recommend us?", [
        f("rating", "Likelihood to Recommend", "nps", {
          required: true,
          max: 10,
        }),
        f("textarea", "Why this score?", "reason", { rows: 4 }),
        f("text", "Email (optional)", "email"),
      ]),
  },
  {
    id: "product-review",
    name: "Product Review",
    description: "Review a product",
    icon: "⭐",
    category: "Feedback",
    build: () =>
      withFields("Product Review", "Share your thoughts.", [
        f("text", "Product Name", "productName", { required: true }),
        f("rating", "Rating", "rating", { required: true, max: 5 }),
        f("text", "Review Title", "title", { required: true }),
        f("textarea", "Your Review", "review", { required: true, rows: 5 }),
        f("text", "Your Name", "authorName", { required: true }),
        f("email", "Email", "email"),
        f("file", "Product Photos", "photos", {
          accept: "image/*",
          multiple: true,
        }),
      ]),
  },
  {
    id: "bug-report",
    name: "Bug Report",
    description: "Report a bug",
    icon: "🐛",
    category: "Feedback",
    build: () =>
      withFields("Bug Report", "Help us fix issues.", [
        f("text", "Title", "title", { required: true }),
        f("select", "Severity", "severity", {
          required: true,
          options: [
            { label: "Critical", value: "critical" },
            { label: "High", value: "high" },
            { label: "Medium", value: "medium" },
            { label: "Low", value: "low" },
          ],
        }),
        f("textarea", "Steps to Reproduce", "steps", {
          required: true,
          rows: 5,
        }),
        f("textarea", "Expected Behavior", "expected", { rows: 3 }),
        f("textarea", "Actual Behavior", "actual", { rows: 3 }),
        f("file", "Screenshots", "screenshots", {
          accept: "image/*",
          multiple: true,
        }),
        f("email", "Your Email", "email", { required: true }),
      ]),
  },
  {
    id: "feature-request",
    name: "Feature Request",
    description: "Suggest a feature",
    icon: "💡",
    category: "Feedback",
    build: () =>
      withFields("Feature Request", "What would you like to see?", [
        f("text", "Feature Title", "title", { required: true }),
        f("select", "Priority", "priority", {
          options: [
            { label: "Nice to have", value: "low" },
            { label: "Important", value: "medium" },
            { label: "Critical", value: "high" },
          ],
        }),
        f("textarea", "Description", "description", {
          required: true,
          rows: 5,
        }),
        f("textarea", "Use Case", "useCase", { rows: 4 }),
        f("email", "Your Email", "email"),
      ]),
  },
  {
    id: "website-feedback",
    name: "Website Feedback",
    description: "Website UX feedback",
    icon: "🌐",
    category: "Feedback",
    build: () =>
      withFields("Website Feedback", "How's our website?", [
        f("rating", "Ease of Use", "usability", { max: 5 }),
        f("rating", "Design", "design", { max: 5 }),
        f("rating", "Content Quality", "content", { max: 5 }),
        f("radio", "Would you return?", "return", {
          options: [
            { label: "Definitely", value: "yes" },
            { label: "Maybe", value: "maybe" },
            { label: "No", value: "no" },
          ],
        }),
        f("textarea", "What could we improve?", "improvements", { rows: 4 }),
      ]),
  },

  {
    id: "course-feedback",
    name: "Course Feedback",
    description: "Student feedback form",
    icon: "🎓",
    category: "Education",
    build: () =>
      withFields("Course Feedback", "Help us improve the course.", [
        f("text", "Course Name", "courseName", { required: true }),
        f("text", "Instructor", "instructor", { required: true }),
        f("rating", "Overall Rating", "overall", { required: true, max: 5 }),
        f("rating", "Content Quality", "content", { max: 5 }),
        f("rating", "Teaching Quality", "teaching", { max: 5 }),
        f("textarea", "What did you learn?", "learned", { rows: 4 }),
        f("textarea", "Suggestions", "suggestions", { rows: 4 }),
      ]),
  },
  {
    id: "course-enrollment",
    name: "Course Enrollment",
    description: "Student enrollment",
    icon: "📚",
    category: "Education",
    build: () =>
      withFields("Course Enrollment", "Enroll in our course.", [
        f("text", "Student Name", "studentName", { required: true }),
        f("email", "Email", "email", { required: true }),
        f("tel", "Phone", "phone", { required: true }),
        f("date", "Date of Birth", "dob", { required: true }),
        f("text", "Guardian Name", "guardianName"),
        f("tel", "Guardian Phone", "guardianPhone"),
        f("select", "Course", "course", {
          required: true,
          options: [
            { label: "Web Development", value: "web-dev" },
            { label: "Data Science", value: "data-science" },
            { label: "UI/UX Design", value: "design" },
          ],
        }),
      ]),
  },
  {
    id: "quiz",
    name: "Simple Quiz",
    description: "Basic quiz form",
    icon: "❓",
    category: "Education",
    build: () =>
      withFields("Pop Quiz", "Test your knowledge.", [
        f("radio", "What is 2 + 2?", "q1", {
          required: true,
          options: [
            { label: "3", value: "3" },
            { label: "4", value: "4" },
            { label: "5", value: "5" },
          ],
        }),
        f("radio", "Capital of France?", "q2", {
          required: true,
          options: [
            { label: "Paris", value: "paris" },
            { label: "London", value: "london" },
            { label: "Berlin", value: "berlin" },
          ],
        }),
        f("text", "Your Name", "studentName", { required: true }),
      ]),
  },
  {
    id: "parent-contact",
    name: "Parent Contact Info",
    description: "Collect parent details",
    icon: "👨‍👩‍👧",
    category: "Education",
    build: () =>
      withFields("Parent Contact Info", "Keep in touch with us.", [
        f("text", "Student Name", "studentName", { required: true }),
        f("text", "Class / Grade", "grade", { required: true }),
        f("text", "Parent Name", "parentName", { required: true }),
        f("tel", "Primary Phone", "primaryPhone", { required: true }),
        f("tel", "Alternate Phone", "alternatePhone"),
        f("email", "Email", "email", { required: true }),
        f("textarea", "Emergency Contact Info", "emergency", { rows: 3 }),
      ]),
  },

  {
    id: "contact-card",
    name: "Personal Contact",
    description: "Share your info",
    icon: "📇",
    category: "Personal",
    build: () =>
      withFields("My Contact Info", "Share your details with me.", [
        f("text", "Full Name", "name", { required: true }),
        f("email", "Email", "email", { required: true }),
        f("tel", "Phone", "phone"),
        f("url", "Website", "website"),
        f("url", "LinkedIn", "linkedin"),
        f("textarea", "About You", "about", { rows: 4 }),
      ]),
  },
  {
    id: "birthday-rsvp",
    name: "Birthday RSVP",
    description: "Party RSVP",
    icon: "🎂",
    category: "Personal",
    build: () =>
      withFields("Birthday Party RSVP", "Join the celebration!", [
        f("text", "Your Name", "name", { required: true }),
        f("radio", "Will you come?", "attending", {
          required: true,
          options: [
            { label: "Yes!", value: "yes" },
            { label: "Sadly no", value: "no" },
          ],
        }),
        f("number", "How many guests?", "guests", { min: 1, max: 10 }),
        f("select", "Food Preference", "food", {
          options: [
            { label: "Vegetarian", value: "veg" },
            { label: "Non-vegetarian", value: "non-veg" },
            { label: "Vegan", value: "vegan" },
          ],
        }),
        f("textarea", "Gift Ideas", "gifts", { rows: 3 }),
      ]),
  },
  {
    id: "recipe-submission",
    name: "Recipe Submission",
    description: "Share a recipe",
    icon: "🍳",
    category: "Personal",
    build: () =>
      withFields("Share Your Recipe", "We love new recipes!", [
        f("text", "Recipe Name", "recipeName", { required: true }),
        f("text", "Your Name", "authorName", { required: true }),
        f("select", "Category", "category", {
          required: true,
          options: [
            { label: "Breakfast", value: "breakfast" },
            { label: "Lunch", value: "lunch" },
            { label: "Dinner", value: "dinner" },
            { label: "Dessert", value: "dessert" },
            { label: "Snack", value: "snack" },
          ],
        }),
        f("number", "Prep Time (min)", "prepTime"),
        f("number", "Cook Time (min)", "cookTime"),
        f("textarea", "Ingredients", "ingredients", {
          required: true,
          rows: 6,
        }),
        f("textarea", "Instructions", "instructions", {
          required: true,
          rows: 8,
        }),
        f("file", "Recipe Photo", "photo", {
          accept: "image/*",
          multiple: false,
        }),
      ]),
  },
  {
    id: "pet-info",
    name: "Pet Information",
    description: "Pet details form",
    icon: "🐾",
    category: "Personal",
    build: () =>
      withFields("Pet Information", "Tell us about your pet.", [
        f("text", "Pet Name", "petName", { required: true }),
        f("select", "Species", "species", {
          required: true,
          options: [
            { label: "Dog", value: "dog" },
            { label: "Cat", value: "cat" },
            { label: "Bird", value: "bird" },
            { label: "Fish", value: "fish" },
            { label: "Other", value: "other" },
          ],
        }),
        f("text", "Breed", "breed"),
        f("number", "Age (years)", "age"),
        f("select", "Gender", "gender", {
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        }),
        f("textarea", "Special Notes", "notes", { rows: 3 }),
        f("file", "Pet Photo", "photo", {
          accept: "image/*",
          multiple: false,
        }),
      ]),
  },
  {
    id: "wishlist",
    name: "Wishlist",
    description: "Create a wishlist",
    icon: "🎁",
    category: "Personal",
    build: () =>
      withFields("My Wishlist", "Things I'd love to receive.", [
        f("text", "Your Name", "ownerName", { required: true }),
        f("text", "Item 1", "item1", { required: true }),
        f("url", "Item 1 Link", "item1Link"),
        f("text", "Item 2", "item2"),
        f("url", "Item 2 Link", "item2Link"),
        f("text", "Item 3", "item3"),
        f("url", "Item 3 Link", "item3Link"),
        f("textarea", "Notes", "notes", { rows: 3 }),
      ]),
  },
];


export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  "Business",
  "HR",
  "Events",
  "Feedback",
  "Education",
  "Personal",
  "Contact",
];