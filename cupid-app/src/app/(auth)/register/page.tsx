import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract text fields
    const userData = {
      id: Date.now().toString(),
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string, // In production, hash this!
      birthday: formData.get('birthday') as string,
      gender: formData.get('gender') as string,
      sexuality: formData.get('sexuality') as string,
      relationshipIntent: formData.get('relationshipIntent') as string,
      phone: formData.get('phone') as string,
      bio: formData.get('bio') as string,
      occupation: formData.get('occupation') as string,
      education: formData.get('education') as string,
      location: formData.get('location') as string,
      interests: JSON.parse(formData.get('interests') as string || '[]'),
      questionAnswers: JSON.parse(formData.get('questionAnswers') as string || '{}'),
      cupidScore: 0,
      cupidRank: null,
      joinedDate: new Date().toISOString(),
      photos: [] as string[],
    };

    // Handle photo uploads
    const photoFiles: File[] = [];
    let photoIndex = 0;
    
    while (formData.has(`photo_${photoIndex}`)) {
      const file = formData.get(`photo_${photoIndex}`) as File;
      if (file && file.size > 0) {
        photoFiles.push(file);
      }
      photoIndex++;
    }

    // In a real app, you would:
    // 1. Upload photos to cloud storage (AWS S3, Cloudinary, etc.)
    // 2. Store user data in database (Supabase, PostgreSQL, etc.)
    // 3. Hash the password
    // 4. Send verification email
    // 5. Create proper authentication tokens

    // For demo purposes, we'll simulate photo URLs
    userData.photos = photoFiles.map((_, index) => `/api/placeholder/300/400?user=${userData.id}&photo=${index}`);

    // Simulate database save delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, you'd save to Supabase like this:
    // const { data, error } = await supabase
    //   .from('profiles')
    //   .insert([{
    //     id: userData.id,
    //     first_name: userData.firstName,
    //     last_name: userData.lastName,
    //     email: userData.email,
    //     birthday: userData.birthday,
    //     gender_identity: userData.gender,
    //     sexuality: userData.sexuality,
    //     relationship_intent: userData.relationshipIntent,
    //     phone: userData.phone,
    //     bio: userData.bio,
    //     occupation: userData.occupation,
    //     education: userData.education,
    //     location: userData.location,
    //     interests: userData.interests,
    //     photos: userData.photos,
    //     cupid_score: 0,
    //     created_at: new Date().toISOString()
    //   }]);

    // Save question answers to separate table
    // const questionEntries = Object.entries(userData.questionAnswers).map(([questionId, answer]) => ({
    //   user_id: userData.id,
    //   question_id: questionId,
    //   free_text: answer,
    //   created_at: new Date().toISOString()
    // }));

    // await supabase.from('survey_answers').insert(questionEntries);

    // For the demo, we'll process the AI embeddings asynchronously
    // In production, you'd call your Python service:
    // try {
    //   for (const [questionId, answer] of Object.entries(userData.questionAnswers)) {
    //     await fetch('http://your-python-service/process', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ 
    //         answer_id: `${userData.id}_${questionId}`,
    //         question: getQuestionText(questionId),
    //         answer: answer 
    //       })
    //     });
    //   }
    // } catch (error) {
    //   console.error('Failed to process AI embeddings:', error);
    // }

    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        cupidScore: userData.cupidScore,
        photos: userData.photos,
        ...userData
      },
      message: 'Account created successfully!'
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create account',
        message: 'An error occurred while creating your account. Please try again.'
      },
      { status: 500 }
    );
  }
}

// Helper function to get question text by ID (for AI processing)
function getQuestionText(questionId: string): string {
  const questions: { [key: string]: string } = {
    'q1': 'If you were a kitchen appliance, which would you be?',
    'q2': 'Your ideal weekend involves:',
    'q3': 'In a zombie apocalypse, you would be:',
    'q4': 'If your pet could talk for one day, what would be the most embarrassing thing they could reveal about you?'
  };
  
  return questions[questionId] || '';
}