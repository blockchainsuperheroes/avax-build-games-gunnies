from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class MyPageNumPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "item_per_page"

    def get_paginated_response(self, data):
        return Response(
            {
                "count": self.page.paginator.count,
                "total_pages": self.page.paginator.num_pages,
            },
        )
