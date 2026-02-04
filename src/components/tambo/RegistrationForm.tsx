'use client';

import React from 'react';
import { useTamboComponentState, TamboPropStreamProvider } from '@tambo-ai/react';

interface RegistrationFormProps {
  eventId: string;
  eventType: 'hackathon' | 'conference' | 'workshop' | 'meetup';
  requiresTeam?: boolean;
  customFields?: Array<{
    name: string;
    type: 'text' | 'email' | 'select' | 'textarea';
    required: boolean;
    options?: string[];
  }>;
}

export function RegistrationForm({ 
  eventId, 
  eventType, 
  requiresTeam = false, 
  customFields = [] 
}: RegistrationFormProps) {
  type RegistrationFormState = {
    firstName: string;
    lastName: string;
    email: string;
    experience: string;
    skills: string[];
    teamPreference: string;
    dietaryRestrictions: string;
    emergencyContact: string;
    motivation: string;
    customFields: Record<string, string>;
  };

  const [formData, setFormData] = useTamboComponentState<RegistrationFormState>(
    `registration-form-${eventId}`,
    {
      firstName: '',
      lastName: '',
      email: '',
      experience: '',
      skills: [] as string[],
      teamPreference: 'looking',
      dietaryRestrictions: '',
      emergencyContact: '',
      motivation: '',
      customFields: {}
    }
  );

  const [isSubmitting, setIsSubmitting] = useTamboComponentState(
    `registration-submitting-${eventId}`,
    false
  );

  const [submitted, setSubmitted] = useTamboComponentState(
    `registration-submitted-${eventId}`,
    false
  );

  const handleInputChange = (field: string, value: any) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleCustomFieldChange = (fieldName: string, value: any) => {
    if (!formData) return;
    setFormData({
      ...formData,
      customFields: {
        ...formData.customFields,
        [fieldName]: value
      }
    });
  };

  const handleSkillsChange = (skill: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      skills: formData.skills.includes(skill)
        ? formData.skills.filter((s) => s !== skill)
        : [...formData.skills, skill]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  // Guard: the tambo state hook may return undefined until initialized
  if (!formData) {
    return null;
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-green-900 mb-2">Registration Successful!</h2>
        <p className="text-green-700 mb-4">
          Welcome to the event! You'll receive a confirmation email shortly with next steps.
        </p>
        <div className="space-y-2 text-sm text-green-600">
          <p>✅ Registration confirmed</p>
          <p>📧 Confirmation email sent</p>
          {requiresTeam && <p>👥 You can now start looking for teammates</p>}
          <p>📱 Event updates will be sent via email</p>
        </div>
      </div>
    );
  }

  const commonSkills = eventType === 'hackathon' 
    ? ['JavaScript', 'Python', 'React', 'Node.js', 'Machine Learning', 'UI/UX Design', 'Mobile Development', 'DevOps', 'Data Science', 'Blockchain']
    : eventType === 'conference'
    ? ['Leadership', 'Public Speaking', 'Strategy', 'Innovation', 'Networking', 'Industry Knowledge']
    : eventType === 'workshop'
    ? ['Learning', 'Practice', 'Collaboration', 'Hands-on Experience', 'Skill Building']
    : ['Networking', 'Community Building', 'Discussion', 'Sharing Ideas'];

  return (
    <TamboPropStreamProvider>
      <TamboPropStreamProvider.Success>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <h2 className="text-2xl font-bold mb-2">
              {eventType === 'hackathon' ? '🚀 Join the Hackathon' :
               eventType === 'conference' ? '🎤 Register for Conference' :
               eventType === 'workshop' ? '🛠️ Workshop Registration' :
               '🤝 Meetup Registration'}
            </h2>
            <p className="text-blue-100">
              {eventType === 'hackathon' ? 'Ready to build something amazing? Let\'s get you registered!' :
               eventType === 'conference' ? 'Join industry leaders and expand your network.' :
               eventType === 'workshop' ? 'Learn new skills in a hands-on environment.' :
               'Connect with like-minded individuals in your community.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Experience & Skills</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select your experience level</option>
                  <option value="beginner">Beginner (0-1 years)</option>
                  <option value="intermediate">Intermediate (2-4 years)</option>
                  <option value="advanced">Advanced (5+ years)</option>
                  <option value="expert">Expert (10+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills & Technologies
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {commonSkills.map((skill) => (
                    <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.skills.includes(skill)}
                        onChange={() => handleSkillsChange(skill)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Preferences (for hackathons) */}
            {requiresTeam && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Team Preferences</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Status
                  </label>
                  <select
                    value={formData.teamPreference}
                    onChange={(e) => handleInputChange('teamPreference', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="looking">Looking for a team</option>
                    <option value="have-team">Already have a team</option>
                    <option value="solo">Participating solo</option>
                    <option value="forming">Forming a new team</option>
                  </select>
                </div>
              </div>
            )}

            {/* Motivation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Tell Us More</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What motivates you to join this event?
                </label>
                <textarea
                  value={formData.motivation}
                  onChange={(e) => handleInputChange('motivation', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share what excites you about this event..."
                />
              </div>
            </div>

            {/* Custom Fields */}
            {customFields.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                
                {customFields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.name} {field.required && '*'}
                    </label>
                    
                    {field.type === 'text' && (
                      <input
                        type="text"
                        required={field.required}
                        value={formData.customFields[field.name] || ''}
                        onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                    
                    {field.type === 'select' && field.options && (
                      <select
                        required={field.required}
                        value={formData.customFields[field.name] || ''}
                        onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select an option</option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                    
                    {field.type === 'textarea' && (
                      <textarea
                        required={field.required}
                        value={formData.customFields[field.name] || ''}
                        onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Additional Requirements */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Final Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dietary Restrictions or Allergies
                </label>
                <input
                  type="text"
                  value={formData.dietaryRestrictions}
                  onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any dietary restrictions we should know about?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact (Name and Phone)
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Emergency contact information"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isSubmitting 
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Registering...
                  </div>
                ) : (
                  `Complete Registration for ${eventType.charAt(0).toUpperCase() + eventType.slice(1)}`
                )}
              </button>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
                By registering, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </form>
        </div>
      </TamboPropStreamProvider.Success>
      
      <TamboPropStreamProvider.Streaming>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 animate-pulse">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </TamboPropStreamProvider.Streaming>
    </TamboPropStreamProvider>
  );
}