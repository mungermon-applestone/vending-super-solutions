
export default function ProductLoading() {
  return (
    <div className="container mx-auto py-16">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="h-[400px] bg-gray-200 rounded-lg"></div>
            <div>
              <div className="h-10 w-3/4 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
              </div>
              
              <div className="mt-8">
                <div className="h-8 w-1/3 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="h-8 w-1/3 bg-gray-200 rounded mb-6 mx-auto"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded mb-10 mx-auto"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-100 rounded-lg p-6">
                  <div className="h-10 w-10 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-6 w-2/3 bg-gray-200 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
