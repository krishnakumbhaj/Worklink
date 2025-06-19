'use client';
import { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const PostProjectForm = () => {
            const [formData, setFormData] = useState({
                        userId: '',
                        title: '',
                        description: '',
                        budget: '',
                        skillsRequired: '',
                        deadline: '',
                        category: '',
            });

            // Add formErrors state
            const [formErrors, setFormErrors] = useState<Partial<typeof formData>>({});

            const [loading, setLoading] = useState(false);
            const [toastMsg, setToastMsg] = useState('');
            const [toastType, setToastType] = useState('');
            const { data: session } = useSession();

            const categoryOptions = [
                        "Web Development",
                        "Mobile Development",
                        "UI/UX Design",
                        "Graphic Design",
                        "Content Writing",
                        "Digital Marketing",
                        "Data Analysis",
                        "Other"
            ];

            const showToast = (message: string, type: string) => {
                        setToastMsg(message);
                        setToastType(type);
                        setTimeout(() => {
                                    setToastMsg('');
                                    setToastType('');
                        }, 3000);
            };

            // Validation function
            const validate = () => {
                        const errors: Partial<typeof formData> = {};
                        // if (!formData.email) errors.email = 'Email is required';
                        if (!formData.title) errors.title = 'Title is required';
                        if (!formData.description) errors.description = 'Description is required';
                        if (!formData.budget) errors.budget = 'Budget is required';
                        if (!formData.skillsRequired) errors.skillsRequired = 'Skills are required';
                        if (!formData.deadline) errors.deadline = 'Deadline is required';
                        if (!formData.category) errors.category = 'Category is required';
                        return errors;
            };

           // Add this state
const [customCategory, setCustomCategory] = useState('');

// In your handleChange, add this for category:
const handleChange = (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
            setFormErrors({ ...formErrors, [name]: undefined });

            // Reset customCategory if not selecting "Other"
            if (name === "category" && value !== "Other") {
                        setCustomCategory('');
            }
};

// In your handleSubmit, use customCategory if needed:
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const errors = validate();
            setFormErrors(errors);
            if (Object.keys(errors).length > 0) {
                        showToast('Please fix the errors in the form.', 'error');
                        return;
            }
            setLoading(true);
            try {
                        const dataToSend = {
                                    ...formData,
                                    category: formData.category === "Other" ? customCategory : formData.category,
                        };
                        const response = await axios.post('/api/projects', dataToSend);

                        if (response.status === 201) {
                                    showToast('🎉 Project posted successfully!', 'success');
                                    setFormData({
                                                userId: session?.user?.id || '',
                                                // email: '',
                                                title: '',
                                                description: '',
                                                budget: '',
                                                skillsRequired: '',
                                                deadline: '',
                                                category: '',
                                    });
                                    setCustomCategory('');
                                    setFormErrors({});
                        }
            } catch (error: unknown) {
                        if (axios.isAxiosError(error)) {
                                    showToast(error.response?.data?.message || 'Something went wrong.', 'error');
                        } else {
                                    showToast('Something went wrong.', 'error');
                        }
            } finally {
                        setLoading(false);
            }
};


            return (
                        <div className="max-w-5xl mx-auto py-4 p-8 bg-zinc-900  shadow-2xl rounded-3xl mt-2 border border-[#894cd1]">
                                    <div className="mb-8">
                                                <h2 className="text-3xl font-bold text-white mb-2">Post a New Project</h2>
                                                <p className="text-white">Fill in the details below to post your project and find the perfect freelancer</p>
                                    </div>

                                    {toastMsg && (
                                                <div
                                                            className={`mb-6 px-4 py-3 rounded-xl text-white flex items-center ${
                                                                        toastType === 'success' ? 'bg-green-600' : 'bg-red-600'
                                                            }`}
                                                >
                                                            <span className="mr-2 text-xl">{toastType === 'success' ? '✓' : '✕'}</span>
                                                            <p>{toastMsg}</p>
                                                </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            
                                                            <div className="space-y-2">
                                                                        <label className="block text-sm font-medium text-white">Project Title</label>
                                                                        <input
                                                                                    name="title"
                                                                                    placeholder="Give your project a descriptive title"
                                                                                    value={formData.title}
                                                                                    onChange={handleChange}
                                                                                    required
                                                                                   className={`w-full px-4 py-3 border text-white  rounded-2xl  bg-[#25232a] focus:outline-none focus:ring-2 transition-all 
                                      ${formErrors.title 
                                                ? 'border-red-300 focus:ring-red-300 bg-red-50' 
                                                : 'border-gray-300 focus:ring-[#894cd1] focus:border-[#894cd1]'}`}
                                                                        />
                                                                        {formErrors.title && <p className="text-xs text-red-500">{formErrors.title}</p>}
                                                            </div>
                                                </div>

                                                <div className="space-y-2">
                                                            <label className="block text-sm font-medium text-white">Project Description</label>
                                                            <textarea
                                                                        name="description"
                                                                        placeholder="Describe your project in detail, including expectations and requirements"
                                                                        value={formData.description}
                                                                        onChange={handleChange}
                                                                        required
                                                                        rows={5}
                                                                       className={`w-full px-4 py-3 border  rounded-2xl text-white  bg-[#25232a] focus:outline-none focus:ring-2 transition-all 
                                      ${formErrors.description 
                                                ? 'border-red-300 focus:ring-red-300 bg-red-50' 
                                                : 'border-gray-300 focus:ring-[#894cd1] focus:border-[#894cd1]'}`}
                                                            />
                                                            {formErrors.description && <p className="text-xs text-red-500">{formErrors.description}</p>}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="space-y-2">
                                                                        <label className="block text-sm font-medium text-white">Budget</label>
                                                                        <div className="relative">
                                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                                                <span className="text-gray-500"></span>
                                                                                    </div>
                                                                                    <input
                                                                                                name="budget"
                                                                                                placeholder="Enter your budget"
                                                                                                value={formData.budget}
                                                                                                onChange={handleChange}
                                                                                                required
                                                                                                className={`w-full px-4 py-3 border  rounded-2xl text-white  bg-[#25232a] focus:outline-none focus:ring-2 transition-all 
                                      ${formErrors.budget 
                                                ? 'border-red-300 focus:ring-red-300 bg-red-50' 
                                                : 'border-gray-300 focus:ring-[#894cd1] focus:border-[#894cd1]'}`}
                                                                                    />
                                                                        </div>
                                                                        {formErrors.budget && <p className="text-xs text-red-500">{formErrors.budget}</p>}
                                                            </div>
                                                            
                                                            <div className="space-y-2">
                                                                        <label className="block text-sm font-medium text-white">Deadline</label>
                                                                        <input
                                                                                    name="deadline"
                                                                                    type="date"
                                                                                    value={formData.deadline}
                                                                                    onChange={handleChange}
                                                                                    required
                                                                                    className={`w-full px-4 py-3 border  rounded-2xl text-white  bg-[#25232a] focus:outline-none focus:ring-2 transition-all 
                                      ${formErrors.deadline 
                                                ? 'border-red-300 focus:ring-red-300 bg-red-50' 
                                                : 'border-gray-300 focus:ring-[#894cd1] focus:border-[#894cd1]'}`}
                                                                        />
                                                                        {formErrors.deadline && <p className="text-xs text-red-500">{formErrors.deadline}</p>}
                                                            </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="space-y-2">
                                                                        <label className="block text-sm font-medium text-white">Required Skills</label>
                                                                        <input
                                                                                    name="skillsRequired"
                                                                                    placeholder="React, Node.js, UI Design, etc."
                                                                                    value={formData.skillsRequired}
                                                                                    onChange={handleChange}
                                                                                    required
                                                                                    className={`w-full px-4 py-3 border  rounded-2xl text-white  bg-[#25232a] focus:outline-none focus:ring-2 transition-all 
                                      ${formErrors.skillsRequired 
                                                ? 'border-red-300 focus:ring-red-300 bg-red-50' 
                                                : 'border-gray-300 focus:ring-[#894cd1] focus:border-[#894cd1]'}`}
                                                                        />
                                                                        <p className="text-xs text-[#894cd1]">Separate skills with commas</p>
                                                                        {formErrors.skillsRequired && <p className="text-xs text-red-500">{formErrors.skillsRequired}</p>}
                                                            </div>
                                                            
                                                            <div className="space-y-2">
                                                                        <label className="block text-sm font-medium text-white">Category</label>
                                                                        <select
                                                                                    name="category"
                                                                                    value={formData.category}
                                                                                    onChange={handleChange}
                                                                                    required
                                                                                   className={`w-full px-4 py-3 border  rounded-2xl text-white  bg-[#25232a] focus:outline-none focus:ring-2 transition-all 
                                      ${formErrors.category 
                                                ? 'border-red-300 focus:ring-red-300 bg-red-50' 
                                                : 'border-gray-300 focus:ring-[#894cd1] focus:border-[#894cd1]'}`}
                                                                        >
                                                                                    <option value="" disabled>Select a category</option>
                                                                                    {categoryOptions.map((category) => (
                                                                                                <option key={category} value={category}>{category}</option>
                                                                                    ))}
                                                                        </select>
                                                                        {formErrors.category && <p className="text-xs text-red-500">{formErrors.category}</p>}
                                                            </div>
                                                </div>

                                                <div className="pt-4">
                                                           <button
  type="submit"
  disabled={loading}
  className="w-full md:w-auto px-4 py-3 bg-[#894cd1] text-white font-medium rounded-xl 
    hover:bg-purple-700 hover:shadow-lg hover:scale-105 hover:-translate-y-1 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
    transition-all duration-300 ease-in-out transform 
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:hover:shadow-none"
>
  {loading ? (
    <span className="flex items-center justify-center">
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Posting...
    </span>
  ) : (
    <span className="flex items-center justify-center relative overflow-hidden">
      Post Project
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
    </span>
  )}
</button>
                                                </div>
                                    </form>
                        </div>
            );
};

export default PostProjectForm;